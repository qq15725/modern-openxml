import type { ColorStop, NormalizedFill, NormalizedGradientFill, NormalizedImageFill } from 'modern-idoc'
import type { OoxmlNode } from '../core'
import { OoxmlValue } from '../core'
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

export function parseFill(fill?: OoxmlNode, ctx?: Record<string, any>): NormalizedFill | undefined {
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
        ...parseColor(fill, ctx)!,
      }
    case 'a:gradFill':
      return parseGradientFill(fill, ctx)
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
export function parseBlipFill(fill?: OoxmlNode, ctx?: Record<string, any>): NormalizedImageFill | undefined {
  if (!fill)
    return undefined

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

  const srcRectNode = fill.find('a:srcRect')
  const cropRect = srcRectNode
    ? clearUndef({
        top: srcRectNode.attr<number>('@t', 'ST_Percentage'),
        right: srcRectNode.attr<number>('@r', 'ST_Percentage'),
        bottom: srcRectNode.attr<number>('@b', 'ST_Percentage'),
        left: srcRectNode.attr<number>('@l', 'ST_Percentage'),
      })
    : undefined
  const fillRectNode = fill.find('a:stretch/a:fillRect')
  const stretchRect = fillRectNode
    ? clearUndef({
        top: fillRectNode.attr<number>('@t', 'ST_Percentage'),
        right: fillRectNode.attr<number>('@r', 'ST_Percentage'),
        bottom: fillRectNode.attr<number>('@b', 'ST_Percentage'),
        left: fillRectNode.attr<number>('@l', 'ST_Percentage'),
      })
    : undefined

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

  return {
    image,
    cropRect: cropRect && Object.keys(cropRect).length > 0 ? cropRect : undefined,
    stretchRect: stretchRect && Object.keys(stretchRect).length > 0 ? stretchRect : undefined,
    dpi: fill.attr<number>('@dpi', 'number'),
    opacity: fill.attr<number>('a:blip/a:alphaModFix/@amt', 'ST_PositivePercentage'),
    tile: tile && Object.keys(tile).length > 0 ? tile : undefined,
    rotateWithShape: fill.attr<boolean>('@rotWithShape', 'boolean'),
  }
}

export function parseGradientFill(gradFill?: OoxmlNode, ctx?: any): NormalizedGradientFill | undefined {
  if (!gradFill)
    return undefined

  const stops: ColorStop[] = gradFill
    .get('a:gsLst/a:gs')
    .map((gs) => {
      return {
        ...parseColor(gs, ctx)!,
        offset: (gs.attr<number>('@pos', 'positiveFixedPercentage') ?? 0),
      }
    })
    .filter(({ color }) => color)
    .sort((a, b) => a.offset - b.offset)

  if (!stops.length)
    return undefined

  if (gradFill.attr('a:path/@path') === 'circle') {
    // const fillToRect = gradFill.find('a:path/a:fillToRect')
    // const l = fillToRect?.attr('@l', 'percentage')
    // const t = fillToRect?.attr('@t', 'percentage')
    // const r = fillToRect?.attr('@r', 'percentage')
    // const b = fillToRect?.attr('@b', 'percentage')
    return {
      radialGradient: {
        stops,
      },
    }
  }

  // const scaled = gradFill.attr('a:lin/@scaled')
  return {
    linearGradient: {
      angle: ((gradFill.attr<number>('a:lin/@ang', 'positiveFixedAngle') ?? 0) + 90) % 360,
      stops,
    },
  }
}

export function stringifyFill(fill?: NormalizedFill, isPic = false): string | undefined {
  if (!fill)
    return undefined

  if (Boolean(fill.image) || isPic) {
    const tagName = isPic ? 'p:blipFill' : 'a:blipFill'
    const url = fill.image
      ?? fill.image
    return `<${tagName}${withAttrs([
      withAttr('dpi', OoxmlValue.encode(fill.dpi, 'number')),
      withAttr('rotWithShape', OoxmlValue.encode(fill.rotateWithShape, 'boolean')),
    ])}>
  <a:blip${withAttrs([withAttr('r:embed', url)])}>
    ${withIndents([
      fill.opacity !== undefined
      && `<a:alphaModFix amt="${OoxmlValue.encode(fill.opacity, 'ST_PositivePercentage')}" />`,
    ])}
    <a:lum/>
  </a:blip>
  <a:srcRect${withAttrs([
    !!fill.cropRect?.top && withAttr('t', OoxmlValue.encode(fill.cropRect?.top, 'ST_Percentage')),
    !!fill.cropRect?.right && withAttr('r', OoxmlValue.encode(fill.cropRect?.right, 'ST_Percentage')),
    !!fill.cropRect?.bottom && withAttr('b', OoxmlValue.encode(fill.cropRect?.bottom, 'ST_Percentage')),
    !!fill.cropRect?.left && withAttr('l', OoxmlValue.encode(fill.cropRect?.left, 'ST_Percentage')),
  ])}/>
  <a:stretch>
    <a:fillRect${withAttrs([
      !!fill.stretchRect?.top && withAttr('t', OoxmlValue.encode(fill.stretchRect?.top, 'ST_Percentage')),
      !!fill.stretchRect?.right && withAttr('r', OoxmlValue.encode(fill.stretchRect?.right, 'ST_Percentage')),
      !!fill.stretchRect?.bottom && withAttr('b', OoxmlValue.encode(fill.stretchRect?.bottom, 'ST_Percentage')),
      !!fill.stretchRect?.left && withAttr('l', OoxmlValue.encode(fill.stretchRect?.left, 'ST_Percentage')),
    ])}/>
  </a:stretch>
</${tagName}>`
  }
  else if (Boolean(fill.linearGradient) || Boolean(fill.radialGradient)) {
    return stringifyGradientFill(fill)
  }
  else if (fill.color) {
    return stringifySolidFill(fill.color)
  }
  return `<a:noFill/>`
}

export function stringifySolidFill(color: string): string {
  return `<a:solidFill>
  ${withIndents(stringifyColor(color))}
</a:solidFill>`
}

export function stringifyGradientFill(fill: NormalizedGradientFill): string | undefined {
  const { linearGradient } = fill
  // TODO radialGradient

  if (linearGradient) {
    const { angle, stops } = linearGradient
    let degree = angle
    degree = degree ? (degree + 270) % 360 : degree
    const ang = OoxmlValue.encode(degree, 'positiveFixedAngle')
    const gs = stops.map((stop) => {
      const { offset, color } = stop
      return `<a:gs pos="${offset * 100000}">
    ${withIndents(stringifyColor(color))}
</a:gs>`
    })
    return `<a:gradFill>
  <a:gsLst>
    ${withIndents(gs, 2)}
  </a:gsLst>
  <a:lin${withAttrs([withAttr('ang', ang), withAttr('scaled', 0)])}/>
</a:gradFill>`
  }
  else {
    return undefined
  }
}
