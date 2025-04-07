import type { BackgroundDeclaration } from 'modern-idoc'
import type { OOXMLNode } from '../core'
import { parseFill, stringifyFill } from '../drawing'
import { withIndents } from '../utils'

export function parseBackground(bg?: OOXMLNode, ctx?: any): BackgroundDeclaration | undefined {
  if (!bg)
    return undefined

  return parseFill(bg.find('p:bgPr'), ctx)
}

export function stringifyBackground(bg?: BackgroundDeclaration): string | undefined {
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
