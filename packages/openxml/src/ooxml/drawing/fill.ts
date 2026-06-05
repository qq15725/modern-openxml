import type { ColorStop, NormalizedFill, NormalizedFilter, NormalizedGradientFill, NormalizedImageFill } from 'modern-idoc'
import type { OoxmlNode } from '../core'
import { OoxmlValue } from '../core'
import {
  clearUndef,
  withAttr,
  withAttrs,
  withIndents,
} from '../utils'
import { colorXPath, parseColor, stringifyColor } from './color'

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
      const blip = parseBlipFill(fill, ctx)
      return blip ? { ...blip, enabled: true } : undefined
    }
    case 'a:solidFill':
      return {
        ...parseColor(fill, ctx)!,
        enabled: true,
      }
    case 'a:gradFill': {
      const grad = parseGradientFill(fill, ctx)
      return grad ? { ...grad, enabled: true } : undefined
    }
    case 'a:grpFill':
      return ctx?.parents?.length
        ? ctx.parents[ctx.parents.length - 1]?.fill
        : undefined
    case 'a:pattFill': {
      // idoc 无图案填充,近似为前景色实心填充
      const color = parseColor(fill.find('a:fgClr'), ctx)?.color
        ?? parseColor(fill.find('a:bgClr'), ctx)?.color
      return color ? { color, enabled: true } : undefined
    }
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

// a:blip 调色子元素 -> modern-idoc Effect.filter（CSS 语义：1=原值 / 0~1）
export function parseBlipFilter(blipFill?: OoxmlNode, ctx?: Record<string, any>): NormalizedFilter | undefined {
  const blip = blipFill?.find('a:blip')
  if (!blip)
    return undefined

  const lum = blip.find('a:lum')
  const bright = lum?.attr<number>('@bright', 'ST_Percentage')
  const contrast = lum?.attr<number>('@contrast', 'ST_Percentage')

  let duotone: [string, string] | undefined
  const duotoneNode = blip.find('a:duotone')
  if (duotoneNode) {
    const colors = duotoneNode
      .get(colorXPath)
      .map(node => parseColor(node, ctx)?.color)
      .filter((v): v is string => Boolean(v))
    if (colors.length >= 2)
      duotone = [colors[0], colors[1]]
  }

  let colorChange: { from: string, to: string } | undefined
  const clrChange = blip.find('a:clrChange')
  if (clrChange) {
    const from = parseColor(clrChange.find('a:clrFrom'), ctx)?.color
    const to = parseColor(clrChange.find('a:clrTo'), ctx)?.color
    if (from && to)
      colorChange = { from, to }
  }

  const filter = clearUndef({
    grayscale: blip.find('a:grayscl') ? 1 : undefined,
    // OOXML bright/contrast 以 0 为原值，CSS 以 1 为原值
    brightness: bright !== undefined ? 1 + bright : undefined,
    contrast: contrast !== undefined ? 1 + contrast : undefined,
    blur: blip.find('a:blur')?.attr<number>('@rad', 'ST_PositiveCoordinate'),
    biLevel: blip.find('a:biLevel')?.attr<number>('@thresh', 'ST_PositivePercentage'),
    duotone,
    colorChange,
  }) as NormalizedFilter

  return Object.keys(filter).length > 0 ? filter : undefined
}

// modern-idoc Effect.filter -> a:blip 调色子元素（a:lum 始终输出，保持既有行为）
function stringifyBlipFilter(filter?: NormalizedFilter): string[] {
  const out: string[] = []
  if (filter?.grayscale) {
    out.push('<a:grayscl/>')
  }
  if (filter?.duotone) {
    out.push(`<a:duotone>
  ${withIndents(stringifyColor(filter.duotone[0]))}
  ${withIndents(stringifyColor(filter.duotone[1]))}
</a:duotone>`)
  }
  if (filter?.colorChange) {
    out.push(`<a:clrChange>
  <a:clrFrom>
    ${withIndents(stringifyColor(filter.colorChange.from), 2)}
  </a:clrFrom>
  <a:clrTo>
    ${withIndents(stringifyColor(filter.colorChange.to), 2)}
  </a:clrTo>
</a:clrChange>`)
  }
  if (filter?.biLevel !== undefined) {
    out.push(`<a:biLevel thresh="${OoxmlValue.encode(filter.biLevel, 'ST_PositivePercentage')}"/>`)
  }
  if (filter?.blur !== undefined) {
    out.push(`<a:blur rad="${OoxmlValue.encode(filter.blur, 'ST_PositiveCoordinate')}"/>`)
  }
  out.push(`<a:lum${withAttrs([
    filter?.brightness !== undefined && withAttr('bright', OoxmlValue.encode(filter.brightness - 1, 'ST_Percentage')),
    filter?.contrast !== undefined && withAttr('contrast', OoxmlValue.encode(filter.contrast - 1, 'ST_Percentage')),
  ])}/>`)
  return out
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
      angle: gradFill.attr<number>('a:lin/@ang', 'positiveFixedAngle') ?? 0,
      stops,
    },
  }
}

export function stringifyFill(fill?: NormalizedFill, isPic = false, filter?: NormalizedFilter): string | undefined {
  if (!fill)
    return undefined

  if (Boolean(fill.image) || isPic) {
    const tagName = isPic ? 'p:blipFill' : 'a:blipFill'
    const url = fill.image
    return `<${tagName}${withAttrs([
      withAttr('dpi', OoxmlValue.encode(fill.dpi, 'number')),
      withAttr('rotWithShape', OoxmlValue.encode(fill.rotateWithShape, 'boolean')),
    ])}>
  <a:blip${withAttrs([withAttr('r:embed', url)])}>
    ${withIndents([
      fill.opacity !== undefined
      && `<a:alphaModFix amt="${OoxmlValue.encode(fill.opacity, 'ST_PositivePercentage')}" />`,
      ...stringifyBlipFilter(filter),
    ])}
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
  const { linearGradient, radialGradient } = fill

  const stringifyStops = (stops: { offset: number, color: string }[]): string =>
    withIndents(stops.map((stop) => {
      return `<a:gs pos="${stop.offset * 100000}">
    ${withIndents(stringifyColor(stop.color))}
</a:gs>`
    }), 2)

  if (linearGradient) {
    const { angle, stops } = linearGradient
    const ang = OoxmlValue.encode((angle + 360) % 360, 'positiveFixedAngle')
    return `<a:gradFill>
  <a:gsLst>
    ${stringifyStops(stops)}
  </a:gsLst>
  <a:lin${withAttrs([withAttr('ang', ang), withAttr('scaled', 0)])}/>
</a:gradFill>`
  }
  else if (radialGradient) {
    return `<a:gradFill>
  <a:gsLst>
    ${stringifyStops(radialGradient.stops)}
  </a:gsLst>
  <a:path path="circle">
    <a:fillToRect l="50000" t="50000" r="50000" b="50000"/>
  </a:path>
</a:gradFill>`
  }
  else {
    return undefined
  }
}
