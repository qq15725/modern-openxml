import type { OoxmlNode } from '../core'
import { clearUndef } from '../utils'

export interface Font {
  complexScript?: string
  eastasian?: string
  latin?: string
  symbol?: string
}

export type FontScheme = Record<string, Font>

// a:fontScheme
export function parseFontScheme(fontScheme?: OoxmlNode): FontScheme | undefined {
  if (!fontScheme)
    return undefined

  return fontScheme?.get('*').reduce((props, node) => {
    const key = node.name.match(/a:(\w+)Font/)?.[1]

    if (!key)
      return props

    props[key] = clearUndef({
      complexScript: node.attr('a:cs/@typeface') || undefined,
      eastasian: node.attr('a:ea/@typeface') || undefined,
      latin: node.attr('a:latin/@typeface') || undefined,
      symbol: node.attr('a:sym/@typeface') || undefined,
    })

    return props
  }, {} as Record<string, Font>)
}
