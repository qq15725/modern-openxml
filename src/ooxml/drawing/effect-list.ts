import type { ShadowDeclaration } from 'modern-idoc'
import type { OOXMLNode } from '../core'
import { parseColor } from './color'

function parseInnerShadow(innerShdw?: OOXMLNode, ctx?: any): ShadowDeclaration | undefined {
  if (!innerShdw)
    return undefined
  const color = parseColor(innerShdw, ctx)
  if (!color)
    return undefined
  const blur = Number(innerShdw.attr('@blurRad', 'ST_PositiveCoordinate') ?? 0)
  const dir = Number(innerShdw.attr('@dir', 'ST_PositiveFixedAngle') ?? 0)
  const dist = Number(innerShdw.attr('@dist', 'ST_PositiveCoordinate') ?? 0)
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
function parseOuterShadow(outerShadow?: OOXMLNode, ctx?: any): ShadowDeclaration | undefined {
  const base = parseInnerShadow(outerShadow, ctx)
  if (!base) {
    return undefined
  }
  const sx = Number(outerShadow!.attr('@sx', 'ST_Percentage') ?? 1)
  const sy = Number(outerShadow!.attr('@sy', 'ST_Percentage') ?? 1)
  return {
    ...base,
    offsetX: base!.offsetX! * sx,
    offsetY: base!.offsetY! * sy,
  }
}

// a:effectLst
export function parseEffectList(effectLst?: OOXMLNode, ctx?: any): ShadowDeclaration | undefined {
  if (!effectLst)
    return undefined

  return parseInnerShadow(effectLst.find('a:innerShdw'), ctx)
    ?? parseOuterShadow(effectLst.find('a:outerShdw'), ctx)
}
