import type { OoxmlNode } from '../core'
import { parseColor } from './color'

export type ColorScheme = Record<string, any>

// a:clrScheme
export function parseColorScheme(clrScheme?: OoxmlNode): ColorScheme | undefined {
  if (!clrScheme)
    return undefined

  const map: Record<string, any> = {}

  clrScheme.get('*').forEach((color) => {
    map[color.name.replace('a:', '')] = parseColor(color)?.color
  })

  return map
}
