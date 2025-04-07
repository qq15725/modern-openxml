import type { FillDeclaration, TextureFillDeclaration } from 'modern-idoc'
import type { OOXMLNode } from '../core'
import { OOXMLValue } from '../core'
import {
  clearUndef,
  withAttr,
  withAttrs,
  withIndents,
} from '../utils'
import { parseColor, stringifyColor } from './color'

const tags = [
  'a:noFill',
  'a:blipFill',
  'p:blipFill',
  'a:gradFill',
  'a:grpFill',
  'a:pattFill',
  'a:solidFill',
]

export const fillXPath = `*[(${tags.map(v => `self::${v}`).join(' or ')})]`

export function parseFill(fill?: OOXMLNode, ctx?: Record<string, any>): FillDeclaration | undefined {
  if (fill && !tags.includes(fill?.name)) {
    fill = fill.find(fillXPath)
  }

  if (!fill)
    return undefined

  switch (fill.name) {
    case 'a:blipFill':
    case 'p:blipFill': {
      return parseBlipFill(fill, ctx)
    }
    case 'a:solidFill':
      return {
        color: parseColor(fill, ctx)!,
      }
    case 'a:gradFill':
      return {
        color: parseGradientFill(fill, ctx)!,
      }
    case 'a:grpFill':
      return ctx?.parents?.length
        ? ctx.parents[ctx.parents.length - 1]?.fill
        : undefined
    case 'a:pattFill':
      // TODO
      return undefined
    case 'a:noFill':
    default:
      return undefined
  }
}

// a:BlipFill
export function parseBlipFill(fill?: OOXMLNode, ctx?: Record<string, any>): TextureFillDeclaration | undefined {
  if (!fill)
    return undefined
  const tileNode = fill.find('a:tile')
  const tile = tileNode
    ? clearUndef({
        scaleX: tileNode.attr<number>('@sx', 'ST_Percentage'),
        scaleY: tileNode.attr<number>('@sy', 'ST_Percentage'),
        alignment: tileNode.attr('@algn'),
        translateX: tileNode.attr<number>('@tx', 'ST_Percentage'),
        translateY: tileNode.attr<number>('@ty', 'ST_Percentage'),
        flip: tileNode.attr('@flip'),
      })
    : undefined

  const embed = fill.attr('a:blip/a:extLst//a:ext/asvg:svgBlip/@r:embed')
    ?? fill.attr('a:blip/@r:embed')!

  let src
  if (ctx?.drawing) {
    src = ctx?.drawing.rels.find((v: any) => v.id === embed)?.path
  }
  else {
    src = ctx?.rels?.find((v: any) => v.id === embed)?.path
  }
  src = src ?? embed

  return {
    rotateWithShape: fill.attr<boolean>('@rotWithShape', 'boolean'),
    dpi: fill.attr<number>('@dpi', 'number'),
    src,
    opacity: fill.attr<number>('a:blip/a:alphaModFix/@amt', 'ST_PositivePercentage'),
    tile: tile && Object.keys(tile).length > 0 ? tile : undefined,
  }
}

// p:BlipFill
export function parsePBlipFill(fill?: OOXMLNode, ctx?: Record<string, any>): FillDeclaration | undefined {
  if (!fill)
    return undefined
  const srcRectNode = fill.find('a:srcRect')
  const srcRect = srcRectNode
    ? clearUndef({
        top: srcRectNode.attr<number>('@t', 'ST_Percentage'),
        right: srcRectNode.attr<number>('@r', 'ST_Percentage'),
        bottom: srcRectNode.attr<number>('@b', 'ST_Percentage'),
        left: srcRectNode.attr<number>('@l', 'ST_Percentage'),
      })
    : undefined
  const embed = fill.attr('a:blip/a:extLst//a:ext/asvg:svgBlip/@r:embed')
    ?? fill.attr('a:blip/@r:embed')!

  let image
  if (ctx?.drawing) {
    image = ctx?.drawing.rels.find((v: any) => v.id === embed)?.path
  }
  else {
    image = ctx?.rels?.find((v: any) => v.id === embed)?.path
  }
  image = image ?? embed

  return {
    src: image,
    opacity: fill.attr<number>('a:blip/a:alphaModFix/@amt', 'ST_PositivePercentage'),
    srcRect: srcRect && Object.keys(srcRect).length > 0 ? srcRect : undefined,
  }
}

function parseGradientFill(gradFill?: OOXMLNode, ctx?: any): string | undefined {
  if (!gradFill)
    return undefined

  const colorStops = gradFill
    .get('a:gsLst/a:gs')
    .map((gs) => {
      return {
        color: parseColor(gs, ctx),
        percentage: gs.attr<number>('@pos', 'positiveFixedPercentage') ?? 0,
      }
    })
    .filter(({ color }) => color)
    .sort((a, b) => a.percentage - b.percentage)

  if (!colorStops.length)
    return undefined

  if (gradFill.attr('a:path/@path') === 'circle') {
    // const fillToRect = gradFill.find('a:path/a:fillToRect')
    // const l = fillToRect?.attr('@l', 'percentage')
    // const t = fillToRect?.attr('@t', 'percentage')
    // const r = fillToRect?.attr('@r', 'percentage')
    // const b = fillToRect?.attr('@b', 'percentage')
    return `radial-gradient(${colorStops.map(({ color, percentage }) => `${color} ${percentage}%`).join(',')})`
  }
  const degree = gradFill.attr<number>('a:lin/@ang', 'positiveFixedAngle') ?? 0
  // const scaled = gradFill.attr('a:lin/@scaled')
  return `linear-gradient(${[
    `${(degree + 90) % 360}deg`,
    ...colorStops.map(({ color, percentage }) => `${color} ${percentage}%`),
  ].join(',')})`
}

export function stringifyFill(fill?: FillDeclaration | FillDeclaration, isPic = false): string | undefined {
  if (!fill)
    return undefined

  const _fill = fill as FillDeclaration
  const _image = fill as FillDeclaration

  if (!!_fill.src || isPic) {
    const tagName = isPic ? 'p:blipFill' : 'a:blipFill'
    const url = _fill.src
      ?? _image.src
    return `<${tagName}>
  <a:blip${withAttrs([withAttr('r:embed', url)])}>
    ${withIndents([
      fill.opacity !== undefined
      && `<a:alphaModFix amt="${OOXMLValue.encode(fill.opacity, 'ST_PositivePercentage')}" />`,
    ])}
    <a:lum/>
  </a:blip>
  <a:srcRect/>
  <a:stretch>
    <a:fillRect/>
  </a:stretch>
</${tagName}>`
  }
  else if (_fill.color) {
    return stringifyColor(String(_fill.color ?? '#FFFFFF'))
  }
  return undefined
}
