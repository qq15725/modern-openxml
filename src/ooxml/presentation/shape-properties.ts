import type {
  NormalizedColorFill,
  NormalizedEffect,
  NormalizedFill,
  NormalizedOutline,
  NormalizedShape,
} from 'modern-idoc'
import type { OOXMLNode, OOXMLQueryType } from '../core'
import type { Transform2d } from './transform2d'
import {
  fillXPath,
  parseColor,
  parseEffectList,
  parseFill,
  parseOutline,
  stringifyFill,
  stringifyOutline,
} from '../drawing'
import { clearUndef, withIndents } from '../utils'
import { parseGeometry, stringifyGeometry } from './geometry'
import { parseTransform2d, stringifyTransform2d } from './transform2d'

export interface ShapeProperties extends Transform2d {
  geometry?: NormalizedShape
  fill?: NormalizedFill
  outline?: NormalizedOutline
  effect?: NormalizedEffect
}

export function parseShapeProperties(spPr?: OOXMLNode, ctx?: any): ShapeProperties | undefined {
  if (!spPr)
    return undefined

  const query = ctx?.query ?? spPr.query

  let fill = (parseFill(query(`${fillXPath}`), ctx) ?? {}) as NormalizedColorFill
  if (!spPr.find(`${fillXPath}`)) {
    const fillRef = spPr.find('../p:style/a:fillRef')
    const fillRefIdx = fillRef?.attr<number>('@idx', 'number') ?? 1
    if (ctx?.theme?.fillStyleList?.[fillRefIdx - 1]) {
      // TODO
      fill.color = parseColor(fillRef, ctx)!
    }
  }
  fill = clearUndef(fill)

  let outline = parseOutline(query('a:ln'), {
    ...ctx,
    query: (xpath: string, type?: OOXMLQueryType) => query(`a:ln/${xpath}`, type),
  }) ?? {}
  if (!spPr.find(`a:ln/${fillXPath}`)) {
    const lnRef = spPr.find('../p:style/a:lnRef')
    const lnRefIdx = lnRef?.attr<number>('@idx', 'number') ?? 1
    if (ctx?.theme?.outlineStyleList?.[lnRefIdx - 1]) {
      // TODO
      outline.color = parseColor(lnRef, ctx)
    }
  }
  outline = clearUndef(outline)

  const xfrm = parseTransform2d(spPr.find('a:xfrm'), {
    ...ctx,
    query: (xpath: string, type?: OOXMLQueryType) => query(`a:xfrm/${xpath}`, type),
  })

  const geometry = parseGeometry(query('*[(self::a:prstGeom or self::a:custGeom)]'), {
    ...ctx,
    width: xfrm?.style?.width ?? 0,
    height: xfrm?.style?.height ?? 0,
  })

  return {
    ...xfrm,
    geometry,
    fill: Object.keys(fill).length > 0 ? fill : undefined,
    outline: Object.keys(outline).length > 0 ? outline : undefined,
    effect: parseEffectList(query('a:effectLst'), ctx),
  }
}

export function stringifyShapeProperties(spPr: ShapeProperties, isPic = false): string {
  const xfrm = stringifyTransform2d(spPr as any)
  const geom = stringifyGeometry(spPr.geometry)
  const fill = isPic ? undefined : stringifyFill(spPr.fill)
  const ln = stringifyOutline(spPr.outline)

  return `<p:spPr>
  ${withIndents(xfrm)}
  ${withIndents(geom)}
  ${withIndents(fill)}
  ${withIndents(ln)}
</p:spPr>`
}
