import type { LineCap, LineEndSize, LineEndType, LineJoin, NormalizedOutline } from 'modern-idoc'
import type { OoxmlNode } from '../core'
import { OoxmlValue } from '../core'
import { BiMap, withAttr, withAttrs, withIndents } from '../utils'
import { fillXPath, parseFill, stringifySolidFill } from './fill'

export type PrstDashType
  = | 'solid'
    | 'sysDot'
    | 'sysDash'
    | 'dash'
    | 'dashDot'
    | 'lgDash'
    | 'lgDashDot'
    | 'lgDashDotDot'

const lineCapMap = new BiMap<any, LineCap>({
  flat: 'butt', // default
  rnd: 'round',
  sq: 'square',
})

// a:ln
//
// a:bevel
// a:custDash
// a:extLst
// a:miter
// a:round
export function parseOutline(node?: OoxmlNode, ctx?: any): NormalizedOutline | undefined {
  if (node && node.name !== 'a:ln') {
    node = node.find('a:ln')
  }

  if (!node)
    return undefined

  const query = ctx?.query ?? node.query
  const prstDash = node.attr<PrstDashType>('a:prstDash/@val')
  const _headEnd = node.find('a:headEnd')
  const _tailEnd = node.find('a:tailEnd')

  let lineJoin: LineJoin = 'miter'
  if (node.find('a:round')) {
    lineJoin = 'round'
  }
  else if (node.find('a:bevel')) {
    lineJoin = 'bevel'
  }

  function toWH(val?: 'sm' | 'med' | 'lg'): LineEndSize | undefined {
    return val === 'med' ? 'md' : val
  }

  return {
    enabled: true,
    style: prstDash
      ? prstDash !== 'solid' ? 'dashed' : 'solid'
      : undefined,
    width: node.attr<number>('@w', 'ST_LineWidth'),
    lineCap: lineCapMap.getValue(node.attr('@cap', 'string')) ?? 'butt',
    lineJoin,
    color: parseFill(query(fillXPath), ctx)?.color,
    headEnd: _headEnd
      ? {
          type: _headEnd.attr<LineEndType>('@type')!,
          width: toWH(_headEnd.attr<'sm' | 'med' | 'lg'>('@w', 'ST_LineEndWidth')),
          height: toWH(_headEnd.attr<'sm' | 'med' | 'lg'>('@len', 'ST_LineEndLength')),
        }
      : undefined,
    tailEnd: _tailEnd
      ? {
          type: _tailEnd.attr<LineEndType>('@type')!,
          width: toWH(_tailEnd.attr<'sm' | 'med' | 'lg'>('@w', 'ST_LineEndWidth')),
          height: toWH(_tailEnd.attr<'sm' | 'med' | 'lg'>('@len', 'ST_LineEndLength')),
        }
      : undefined,
  }
}

// function stringifyStrokeDashArray(dashType: DashType, width = 0.5): string {
//   switch (dashType) {
//     case 'sysDot':
//       return `${width},${width}`
//     case 'sysDash':
//       return `${width * 3},${width}`
//     case 'dash':
//       return `${width * 4},${width * 3}`
//     case 'dashDot':
//       return `${width * 4},${width * 3},${width},${width * 3}`
//     case 'lgDash':
//       return `${width * 8},${width * 3}`
//     case 'lgDashDot':
//       return `${width * 8},${width * 3},${width},${width * 3}`
//     case 'lgDashDotDot':
//       return `${width * 8},${width * 3},${width},${width * 3},${width},${width * 3}`
//     case 'solid':
//     default:
//       return ''
//   }
// }

// function stringifyBorderPrstDash(dataArray?: string, borderWidth = 0.5): string {
//   return dataArray
//     ? [
//         'dash',
//         'dashDot',
//         'lgDash',
//         'lgDashDot',
//         'lgDashDotDot',
//         'solid',
//         'sysDash',
//         'sysDot',
//       ].find(item => stringifyStrokeDashArray(item, borderWidth) === dataArray) ?? 'dash'
//     : 'solid'
// }

// LineEndSize: idoc 用 'md',OOXML 用 'med'(WithNone 可能为 'none'/null)
function encodeLineEndSize(size?: string | null): string | undefined {
  if (!size || size === 'none') {
    return undefined
  }
  return size === 'md' ? 'med' : size
}

function stringifyLineEnd(tag: 'headEnd' | 'tailEnd', end?: { type?: string, width?: any, height?: any }): string | boolean {
  if (!end?.type) {
    return false
  }
  return `<a:${tag}${withAttrs([
    withAttr('type', end.type),
    end.width && withAttr('w', encodeLineEndSize(end.width)),
    end.height && withAttr('len', encodeLineEndSize(end.height)),
  ])}/>`
}

export function stringifyOutline(ln?: NormalizedOutline): string | undefined {
  if (!ln)
    return undefined

  // a:ln 子元素顺序:fill -> prstDash -> join -> headEnd -> tailEnd
  return `<a:ln${withAttrs([
    ln.width !== undefined && withAttr('w', OoxmlValue.encode(ln.width, 'ST_LineWidth')),
    ln.lineCap !== undefined && ln.lineCap !== 'butt' && withAttr('cap', lineCapMap.getKey(ln.lineCap)),
  ])}>
    ${withIndents([
      ln.color !== undefined && stringifySolidFill(String(ln.color)),
      ln.color === undefined && '<a:noFill/>',
      ln.style === 'dashed' && '<a:prstDash val="dash"/>',
      ln.style === 'solid' && '<a:prstDash val="solid"/>',
      ln.lineJoin !== undefined && ln.lineJoin !== 'miter' && `<a:${ln.lineJoin}/>`,
      stringifyLineEnd('headEnd', ln.headEnd),
      stringifyLineEnd('tailEnd', ln.tailEnd),
    ])}
</a:ln>`
}
