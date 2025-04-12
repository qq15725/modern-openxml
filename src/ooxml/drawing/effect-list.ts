import type {
  EffectDeclaration,
  InnerShadowDeclaration,
  OuterShadowDeclaration,
  SoftEdgeDeclaration,
} from 'modern-idoc'
import type { OOXMLNode } from '../core'
import { parseColor } from './color'

function parseInnerShadow(innerShdw?: OOXMLNode, ctx?: any): InnerShadowDeclaration | undefined {
  if (!innerShdw)
    return undefined
  const color = parseColor(innerShdw, ctx)
  if (!color)
    return undefined
  const blur = innerShdw.attr<number>('@blurRad', 'ST_PositiveCoordinate') ?? 0
  const dir = innerShdw.attr<number>('@dir', 'ST_PositiveFixedAngle') ?? 0
  const dist = innerShdw.attr<number>('@dist', 'ST_PositiveCoordinate') ?? 0
  const degree = dir + 90
  const radian = (degree / 180) * Math.PI
  const offsetX = dist * Math.sin(radian)
  const offsetY = dist * -Math.cos(radian)
  return {
    color,
    offsetX,
    offsetY,
    blur,
  }
}

// TODO
// @prop('@algn', 'ST_RectAlignment') declare algn?: number
// @prop('@kx', 'ST_FixedAngle') declare kx?: number
// @prop('@ky', 'ST_FixedAngle') declare ky?: number
// @prop('@rotWithShape', 'boolean') declare rotWithShape?: boolean
function parseOuterShadow(outerShdw?: OOXMLNode, ctx?: any): OuterShadowDeclaration | undefined {
  const base = parseInnerShadow(outerShdw, ctx)
  if (!base) {
    return undefined
  }
  const sx = outerShdw!.attr<number>('@sx', 'ST_Percentage') ?? 1
  const sy = outerShdw!.attr<number>('@sy', 'ST_Percentage') ?? 1
  return {
    ...base,
    offsetX: base!.offsetX! * sx,
    offsetY: base!.offsetY! * sy,
  }
}

function parseSoftEdge(softEdge?: OOXMLNode): SoftEdgeDeclaration | undefined {
  if (!softEdge) {
    return undefined
  }

  return {
    radius: softEdge.attr<number>('@rad', 'ST_PositiveCoordinate') ?? 0,
  }
}

// a:effectLst
export function parseEffectList(effectLst?: OOXMLNode, ctx?: any): EffectDeclaration | undefined {
  if (!effectLst)
    return undefined

  return {
    innerShadow: parseInnerShadow(effectLst.find('a:innerShdw'), ctx),
    outerShadow: parseOuterShadow(effectLst.find('a:outerShdw'), ctx),
    softEdge: parseSoftEdge(effectLst.find('a:softEdge')),
  }
}
