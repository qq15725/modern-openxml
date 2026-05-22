import type { NormalizedEffect, NormalizedShadow } from 'modern-idoc'
import type { OoxmlNode } from '../core'
import { parseColor } from './color'

// a:outerShdw / a:innerShdw
//
// modern-idoc 仅保留单一的 shadow 模型(不再区分 inner/outer/softEdge,
// 也不再有 scaleX/scaleY/radius),这里把 OOXML 阴影归一化到该模型。
function parseShadow(shadow?: OoxmlNode, ctx?: any): NormalizedShadow | undefined {
  if (!shadow)
    return undefined
  const color = parseColor(shadow, ctx)?.color
  if (!color)
    return undefined
  const blur = shadow.attr<number>('@blurRad', 'ST_PositiveCoordinate') ?? 0
  const dir = shadow.attr<number>('@dir', 'ST_PositiveFixedAngle') ?? 0
  const dist = shadow.attr<number>('@dist', 'ST_PositiveCoordinate') ?? 0
  const radian = ((dir + 90) / 180) * Math.PI
  return {
    enabled: true,
    color,
    offsetX: dist * Math.sin(radian),
    offsetY: dist * -Math.cos(radian),
    blur,
  }
}

// a:effectLst
export function parseEffectList(effectLst?: OoxmlNode, ctx?: any): NormalizedEffect | undefined {
  if (!effectLst)
    return undefined

  const shadow = parseShadow(effectLst.find('a:outerShdw'), ctx)
    ?? parseShadow(effectLst.find('a:innerShdw'), ctx)

  return { shadow }
}
