import type { Alpha } from './Alpha'
import { defineAttribute, defineChild, defineElement, OOXML } from '../../core'

function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
  hex = hex.replace(/^#/, '')
  if (!/^([0-9A-F]{3}|[0-9A-F]{6})$/i.test(hex)) {
    return null
  }
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('')
  }
  const r = Number.parseInt(hex.substring(0, 2), 16)
  const g = Number.parseInt(hex.substring(2, 4), 16)
  const b = Number.parseInt(hex.substring(4, 6), 16)
  return { r, g, b }
}

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.rgbcolormodelhex
 */
@defineElement('a:srgbClr')
export class RgbColorModelHex extends OOXML {
  @defineAttribute('val') declare val: string

  @defineChild('a:alpha') declare alpha?: Alpha

  get color(): string | undefined {
    const { val, alpha } = this
    const rgb = hexToRgb(val)
    if (rgb) {
      const { r, g, b } = rgb
      return `rgba(${r}, ${g}, ${b}, ${alpha?.val ?? 1})`
    }
    return undefined
  }
}
