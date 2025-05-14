import type { OOXMLNode } from '../core'
import { OOXMLValue } from '../core'
import { withAttr, withAttrs } from '../utils'

export interface Transform2d {
  style?: Transform2dStyle
  rawTransform2d?: RawTransform2d
}

export interface Transform2dStyle {
  left?: number
  top?: number
  width?: number
  height?: number
  rotate?: number
  scaleX?: number
  scaleY?: number
}

export interface RawTransform2d {
  absoluteX?: number
  absoluteY?: number
  offsetX?: number
  offsetY?: number
  extentsCx?: number
  extentsCy?: number
  childOffsetX?: number
  childOffsetY?: number
  childExtentsCx?: number
  childExtentsCy?: number
}

function _parseTransform2dStyle(position: Transform2dStyle, ctx?: any): void {
  if (!ctx?.parents || !ctx.parents.length)
    return
  const parent = ctx.parents[ctx.parents.length - 1]?.transform2d as RawTransform2d
  if (!parent)
    return
  const groupPosition: Record<string, number> = {
    left: Number(parent.offsetX ?? position.left),
    top: Number(parent.offsetY ?? position.top),
    width: Number(parent.extentsCx ?? position.width),
    height: Number(parent.extentsCy ?? position.height),
  }
  const childPosition: Record<string, number> = {
    left: Number(parent.childOffsetX ?? 0),
    top: Number(parent.childOffsetY ?? 0),
    width: Number(parent.childExtentsCx ?? groupPosition.width),
    height: Number(parent.childExtentsCy ?? groupPosition.height),
  }
  const scaleX = childPosition.width ? groupPosition.width / childPosition.width : 1
  const scaleY = childPosition.height ? groupPosition.height / childPosition.height : 1
  if (position.left !== undefined)
    position.left = (position.left - childPosition.left) * scaleX + groupPosition.left
  if (position.top !== undefined)
    position.top = (position.top - childPosition.top) * scaleY + groupPosition.top
  if (position.height !== undefined)
    position.height *= scaleY
  if (position.width !== undefined)
    position.width *= scaleX
  _parseTransform2dStyle(position, {
    ...ctx,
    parents: ctx.parents.slice(0, ctx.parents.length - 1),
  })
}

export function parseTransform2d(xfrm?: OOXMLNode, ctx?: any): Transform2d | undefined {
  const query = ctx?.query ?? xfrm?.query

  const offsetX = query('a:off/@x', 'emu')
  const offsetY = query('a:off/@y', 'emu')
  const extentsCx = query('a:ext/@cx', 'emu')
  const extentsCy = query('a:ext/@cy', 'emu')

  const style = {
    left: offsetX,
    top: offsetY,
    width: extentsCx,
    height: extentsCy,
    rotate: query('@rot', 'ST_Angle') ?? 0,
    scaleX: query('@flipH', 'boolean') ? -1 : 1,
    scaleY: query('@flipV', 'boolean') ? -1 : 1,
  }

  _parseTransform2dStyle(style, ctx)

  const parent = ctx?.parents?.[ctx.parents.length - 1]?.transform2d as RawTransform2d

  const absoluteX = style.left
  const absoluteY = style.top
  if (parent) {
    style.left = (style.left ?? 0) - (parent.absoluteX ?? 0)
    style.top = (style.top ?? 0) - (parent.absoluteY ?? 0)
  }

  return {
    style,
    rawTransform2d: {
      absoluteX,
      absoluteY,
      offsetX,
      offsetY,
      extentsCx,
      extentsCy,
      childOffsetX: query('a:chOff/@x', 'emu'),
      childOffsetY: query('a:chOff/@y', 'emu'),
      childExtentsCx: query('a:chExt/@cx', 'emu'),
      childExtentsCy: query('a:chExt/@cy', 'emu'),
    },
  }
}

export function stringifyTransform2d(xfrm: Transform2d, isGroup = false): string {
  return `<a:xfrm${withAttrs([
    xfrm.style?.rotate ? withAttr('rot', OOXMLValue.encode(xfrm.style?.rotate, 'ST_Angle')) : undefined,
    xfrm.style?.scaleY === -1 && withAttr('flipV', '1'),
    xfrm.style?.scaleX === -1 && withAttr('flipH', '1'),
  ])}>
  <a:off${withAttrs([
    withAttr('x', OOXMLValue.encode(xfrm.style?.left, 'emu')),
    withAttr('y', OOXMLValue.encode(xfrm.style?.top, 'emu')),
  ])}/>
  <a:ext${withAttrs([
    withAttr('cx', OOXMLValue.encode(xfrm.style?.width, 'emu')),
    withAttr('cy', OOXMLValue.encode(xfrm.style?.height, 'emu')),
  ])}/>
  ${isGroup
    ? `<a:chOff${withAttrs([
      withAttr('x', '0'),
      withAttr('y', '0'),
    ])}/>
<a:chExt${withAttrs([
  withAttr('cx', OOXMLValue.encode(xfrm.style?.width, 'emu')),
  withAttr('cy', OOXMLValue.encode(xfrm.style?.height, 'emu')),
])}/>`
    : ''}
</a:xfrm>`
}
