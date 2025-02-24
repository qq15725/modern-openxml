import type { OOXMLNode } from '../core'

export type ColorScheme = Record<string, any>

// a:clrScheme
export function parseColorScheme(clrScheme?: OOXMLNode): ColorScheme | undefined {
  if (!clrScheme)
    return undefined

  const map: Record<string, any> = {}

  clrScheme.get('*').forEach((color) => {
    const key = color.name.replace('a:', '')
    const value = color.attr('a:srgbClr/@val') ?? color.attr('a:sysClr/@lastClr')
    map[key] = value ? `#${value}` : value
  })

  return map
}
