import type { OOXMLNode } from '../core'
import { clearUndef } from '../utils'

export interface Font {
  fontComplexScript?: string
  fontEastasian?: string
  fontLatin?: string
  fontSymbol?: string
  color?: string
}

export type FontScheme = Record<string, Font>

// a:fontScheme
export function parseFontScheme(fontScheme?: OOXMLNode): FontScheme | undefined {
  if (!fontScheme)
    return undefined

  return fontScheme?.get('*').reduce((props, node) => {
    const key = node.name.match(/a:(\w+)Font/)?.[1]
    if (!key)
      return props
    props[key] = clearUndef({
      fontComplexScript: node.attr('a:cs/@typeface') || undefined,
      fontEastasian: node.attr('a:ea/@typeface') || undefined,
      fontLatin: node.attr('a:latin/@typeface') || undefined,
      fontSymbol: node.attr('a:sym/@typeface') || undefined,
    })
    return props
  }, {} as Record<string, Font>)
}
