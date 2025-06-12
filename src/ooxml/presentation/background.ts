import type { NormalizedBackground } from 'modern-idoc'
import type { OOXMLNode } from '../core'
import { parseColor, parseFill, stringifyFill } from '../drawing'
import { withIndents } from '../utils'

export function parseBackground(bg?: OOXMLNode, ctx?: any): NormalizedBackground | undefined {
  if (!bg)
    return undefined

  const bgRef = bg.find('p:bgRef')
  const bgRefIdx = bgRef?.attr<number>('@idx', 'number')
  if (bgRefIdx) {
    const backgroundFillStyleList = ctx?.theme?.backgroundFillStyleList
    if (!backgroundFillStyleList) {
      return undefined
    }
    // TODO
    const bgFill = backgroundFillStyleList[bgRefIdx - 1] ?? backgroundFillStyleList[0]
    if (bgFill?.color === 'phClr') {
      return {
        ...parseColor(bgRef, ctx),
        fillWithShape: true,
      }
    }
    return bgFill
  }
  else {
    return {
      ...parseFill(bg.find('p:bgPr'), ctx),
      fillWithShape: true,
    }
  }
}

export function stringifyBackground(bg?: NormalizedBackground): string | undefined {
  if (!bg)
    return undefined

  const fill = stringifyFill(bg)

  return `<p:bg>
  <p:bgPr>
    ${withIndents(fill, 2)}
    <a:effectLst/>
  </p:bgPr>
</p:bg>`
}
