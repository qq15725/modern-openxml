import type { OutlineDeclaration, SolidFillDeclaration } from 'modern-idoc'
import type { OOXMLNode } from '../core'
import { OOXMLValue } from '../core'
import { withAttr, withAttrs, withIndents } from '../utils'
import { stringifyColor } from './color'
import { fillXPath, parseFill } from './fill'

export interface LineEnd {
  headEnd?: LineEndType
  tailEnd?: LineEndType
}

export enum LineEndType {
  NONE = 'none',
  OVAL = 'oval',
  STEALTH = 'stealth',
  TRIANGLE = 'triangle',
  ARROW = 'arrow',
  DIAMOND = 'diamond',
}

export enum DashType {
  SOLID = 'solid',
  SYS_DOT = 'sysDot',
  SYS_DASH = 'sysDash',
  DASH = 'dash',
  DASH_DOT = 'dashDot',
  LG_DASH = 'lgDash',
  LG_DASH_DOT = 'lgDashDot',
  LG_DASH_DOT_DOT = 'lgDashDotDot',
}

// a:ln
export function parseOutline(node?: OOXMLNode, ctx?: any): OutlineDeclaration | undefined {
  if (node && node.name !== 'a:ln') {
    node = node.find('.//a:ln')
  }

  if (!node)
    return undefined

  const query = ctx?.query ?? node.query
  const prstDash = node.attr('a:prstDash/@val') as DashType
  const fill = parseFill(query(fillXPath), ctx) as SolidFillDeclaration
  const style = prstDash
    ? prstDash !== DashType.SOLID ? 'dashed' : 'solid'
    : undefined
  return {
    style,
    width: node.attr<number>('@w', 'ST_LineWidth'),
    color: fill?.color,
  }
}

// function stringifyStrokeDashArray(dashType: DashType, width = 0.5): string {
//   switch (dashType) {
//     case DashType.SYS_DOT:
//       return `${width},${width}`
//     case DashType.SYS_DASH:
//       return `${width * 3},${width}`
//     case DashType.DASH:
//       return `${width * 4},${width * 3}`
//     case DashType.DASH_DOT:
//       return `${width * 4},${width * 3},${width},${width * 3}`
//     case DashType.LG_DASH:
//       return `${width * 8},${width * 3}`
//     case DashType.LG_DASH_DOT:
//       return `${width * 8},${width * 3},${width},${width * 3}`
//     case DashType.LG_DASH_DOT_DOT:
//       return `${width * 8},${width * 3},${width},${width * 3},${width},${width * 3}`
//     case DashType.SOLID:
//     default:
//       return ''
//   }
// }

// function stringifyBorderPrstDash(dataArray?: string, borderWidth = 0.5): string {
//   return dataArray
//     ? [
//         DashType.DASH,
//         DashType.DASH_DOT,
//         DashType.LG_DASH,
//         DashType.LG_DASH_DOT,
//         DashType.LG_DASH_DOT_DOT,
//         DashType.SOLID,
//         DashType.SYS_DASH,
//         DashType.SYS_DOT,
//       ].find(item => stringifyStrokeDashArray(item, borderWidth) === dataArray) ?? DashType.DASH
//     : DashType.SOLID
// }

// export function parseLineEnd(ln?: OOXMLNode): LineEnd | undefined {
//   if (!ln)
//     return undefined
//   const headEnd = (ln.attr('a:headEnd/@type') as LineEndType) ?? LineEndType.NONE
//   const tailEnd = (ln.attr('a:tailEnd/@type') as LineEndType) ?? LineEndType.NONE
//   return {
//     headEnd,
//     tailEnd,
//   }
// }

export function stringifyOutline(ln?: OutlineDeclaration): string | undefined {
  if (!ln)
    return undefined

  return `<a:ln${withAttrs([
    withAttr('w', OOXMLValue.encode(ln.width, 'ST_LineWidth')),
  ])}>
    ${ln.width ? withIndents(stringifyColor(String(ln.color))) : '<a:noFill/>'}
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
