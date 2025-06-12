import type { LineEndSize, LineEndType, NormalizedOutline } from 'modern-idoc'
import type { OOXMLNode } from '../core'
import { OOXMLValue } from '../core'
import { withAttr, withAttrs, withIndents } from '../utils'
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

// a:ln
//
// a:bevel
// a:custDash
// a:extLst
// a:miter
// a:round
export function parseOutline(node?: OOXMLNode, ctx?: any): NormalizedOutline | undefined {
  if (node && node.name !== 'a:ln') {
    node = node.find('a:ln')
  }

  if (!node)
    return undefined

  const query = ctx?.query ?? node.query
  const prstDash = node.attr<PrstDashType>('a:prstDash/@val')
  const _headEnd = node.find('a:headEnd')
  const _tailEnd = node.find('a:tailEnd')

  function toWH(val?: 'sm' | 'med' | 'lg'): LineEndSize | undefined {
    return val === 'med' ? 'md' : val
  }

  return {
    style: prstDash
      ? prstDash !== 'solid' ? 'dashed' : 'solid'
      : undefined,
    width: node.attr<number>('@w', 'ST_LineWidth'),
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

export function stringifyOutline(ln?: NormalizedOutline): string | undefined {
  if (!ln)
    return undefined

  return `<a:ln${withAttrs([
    ln.width !== undefined && withAttr('w', OOXMLValue.encode(ln.width, 'ST_LineWidth')),
  ])}>
    ${withIndents([
      ln.color !== undefined && stringifySolidFill(String(ln.color)),
      ln.color === undefined && '<a:noFill/>',
    ])}
</a:ln>`

// TODO
//   const prstDash = stringifyBorderPrstDash(ln.borderPrstDash, ln.width)
//   return `<a:ln${withAttrs([
//     withAttr('w', OOXMLValue.encode(ln.width, 'ST_LineWidth')),
//   ])}>
//     ${ln.width ? withIndents(stringifyColor(ln.color)) : '<a:noFill/>'}
//     ${prstDash ? `<a:prstDash val="${prstDash}" />` : ''}
//     <a:headEnd ${withAttrs([withAttr('type', ln.headEnd || LineEndType.NONE)])} />
//     <a:tailEnd ${withAttrs([withAttr('type', ln.tailEnd || LineEndType.NONE)])} />
// </a:ln>`
}
