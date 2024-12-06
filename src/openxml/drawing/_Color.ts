import type { HslColor } from './HslColor'
import type { PresetColor } from './PresetColor'
import type { RgbColorModelHex } from './RgbColorModelHex'
import type { RgbColorModelPercentage } from './RgbColorModelPercentage'
import type { SchemeColor } from './SchemeColor'
import type { SystemColor } from './SystemColor'
import { defineChild, OXML } from '../../core'

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

export class _Color extends OXML {
  @defineChild('a:hslClr') declare hslClr?: HslColor
  @defineChild('a:prstClr') declare prstClr?: PresetColor
  @defineChild('a:schemeClr') declare schemeClr?: SchemeColor
  @defineChild('a:scrgbClr') declare scrgbClr?: RgbColorModelPercentage
  @defineChild('a:srgbClr') declare srgbClr?: RgbColorModelHex
  @defineChild('a:sysClr') declare sysClr?: SystemColor

  get color(): string | undefined {
    if (this.hslClr) {
      // TODO
      return undefined
    }
    else if (this.prstClr) {
      return this.prstClr.val
    }
    else if (this.schemeClr) {
      return this.schemeClr.val
    }
    else if (this.scrgbClr) {
      const { r, g, b, alpha } = this.scrgbClr
      return `rgba(${~~(r * 255)}, ${~~(g * 255)}, ${~~(b * 255)}, ${alpha?.val ?? 1})`
    }
    else if (this.srgbClr) {
      const { val, alpha } = this.srgbClr
      const rgb = hexToRgb(val)
      if (rgb) {
        const { r, g, b } = rgb
        return `rgba(${r}, ${g}, ${b}, ${alpha?.val ?? 1})`
      }
    }
    else if (this.sysClr) {
      return this.sysClr.val
    }
    else {
      return undefined
    }
  }
}
