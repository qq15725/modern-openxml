import type {
  NormalizedEffect,
  NormalizedInnerShadow,
  NormalizedOuterShadow,
  NormalizedSoftEdge,
} from 'modern-idoc'
import type { OOXMLNode } from '../core'
import { parseColor } from './color'

function parseInnerShadow(innerShdw?: OOXMLNode, ctx?: any): NormalizedInnerShadow | undefined {
  if (!innerShdw)
    return undefined
  const color = parseColor(innerShdw, ctx)
  if (!color)
    return undefined
  const blurRadius = innerShdw.attr<number>('@blurRad', 'ST_PositiveCoordinate') ?? 0
  const dir = innerShdw.attr<number>('@dir', 'ST_PositiveFixedAngle') ?? 0
  const dist = innerShdw.attr<number>('@dist', 'ST_PositiveCoordinate') ?? 0
  const radian = ((dir + 90) / 180) * Math.PI
  return {
    color,
    offsetX: dist * Math.sin(radian),
    offsetY: dist * -Math.cos(radian),
    blurRadius,
  }
}

// TODO
// @prop('@algn', 'ST_RectAlignment') declare algn?: number
// @prop('@kx', 'ST_FixedAngle') declare kx?: number
// @prop('@ky', 'ST_FixedAngle') declare ky?: number
// @prop('@rotWithShape', 'boolean') declare rotWithShape?: boolean
function parseOuterShadow(outerShdw?: OOXMLNode, ctx?: any): NormalizedOuterShadow | undefined {
  const base = parseInnerShadow(outerShdw, ctx)
  if (!base) {
    return undefined
  }
  const scaleX = outerShdw!.attr<number>('@sx', 'ST_Percentage') ?? 1
  const scaleY = outerShdw!.attr<number>('@sy', 'ST_Percentage') ?? 1
  return {
    ...base,
    scaleX,
    scaleY,
  }
}

function parseSoftEdge(softEdge?: OOXMLNode): NormalizedSoftEdge | undefined {
  if (!softEdge) {
    return undefined
  }

  return {
    radius: softEdge.attr<number>('@rad', 'ST_PositiveCoordinate') ?? 0,
  }
}

// a:effectLst
export function parseEffectList(effectLst?: OOXMLNode, ctx?: any): NormalizedEffect | undefined {
  if (!effectLst)
    return undefined

  return {
    innerShadow: parseInnerShadow(effectLst.find('a:innerShdw'), ctx),
    outerShadow: parseOuterShadow(effectLst.find('a:outerShdw'), ctx),
    softEdge: parseSoftEdge(effectLst.find('a:softEdge')),
  }
}
