import type { Alpha } from './Alpha'
import type { Theme } from './Theme'
import { defineChild, OOXML } from '../../core'

export interface RGBA {
  r: number
  g: number
  b: number
  a: number
}

export type RGB = Omit<RGBA, 'a'>

// TODO
export abstract class _Color extends OOXML {
  @defineChild('a:alpha') declare alpha?: Alpha
  @defineChild('a:alphaMod') declare alphaMod?: OOXML
  @defineChild('a:alphaOff') declare alphaOff?: OOXML
  @defineChild('a:blue') declare blue?: OOXML
  @defineChild('a:blueMod') declare blueMod?: OOXML
  @defineChild('a:blueOff') declare blueOff?: OOXML
  @defineChild('a:comp') declare comp?: OOXML
  @defineChild('a:gamma') declare gamma?: OOXML
  @defineChild('a:gray') declare gray?: OOXML
  @defineChild('a:green') declare green?: OOXML
  @defineChild('a:greenMod') declare greenMod?: OOXML
  @defineChild('a:greenOff') declare greenOff?: OOXML
  @defineChild('a:hue') declare hue?: OOXML
  @defineChild('a:hueMod') declare hueMod?: OOXML
  @defineChild('a:hueOff') declare hueOff?: OOXML
  @defineChild('a:inv') declare inv?: OOXML
  @defineChild('a:invGamma') declare invGamma?: OOXML
  @defineChild('a:lum') declare lum?: OOXML
  @defineChild('a:lumMod') declare lumMod?: OOXML
  @defineChild('a:lumOff') declare lumOff?: OOXML
  @defineChild('a:red') declare red?: OOXML
  @defineChild('a:redMod') declare redMod?: OOXML
  @defineChild('a:redOff') declare redOff?: OOXML
  @defineChild('a:sat') declare sat?: OOXML
  @defineChild('a:satMod') declare satMod?: OOXML
  @defineChild('a:satOff') declare satOff?: OOXML
  @defineChild('a:shade') declare shade?: OOXML
  @defineChild('a:tint') declare tint?: OOXML

  get a(): number {
    return this.alpha?.val ?? 1
  }

  hslToRgb(h: number, s: number, l: number): RGB {
    h = ((h % 360) + 360) % 360
    const c = (1 - Math.abs(2 * l - 1)) * s // Chroma
    const x = c * (1 - Math.abs((h / 60) % 2 - 1)) // Intermediate value
    const m = l - c / 2 // Adjustment for lightness
    let r
    let g
    let b
    if (h < 60) {
      r = c
      g = x
      b = 0
    }
    else if (h < 120) {
      r = x
      g = c
      b = 0
    }
    else if (h < 180) {
      r = 0
      g = c
      b = x
    }
    else if (h < 240) {
      r = 0
      g = x
      b = c
    }
    else if (h < 300) {
      r = x
      g = 0
      b = c
    }
    else {
      r = c
      g = 0
      b = x
    }
    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)
    return { r, g, b }
  }

  hexToRgb(hex: string): RGB {
    const normalizedHex = hex.startsWith('#') ? hex.slice(1) : hex
    const expandedHex
      = normalizedHex.length === 3
        ? normalizedHex
          .split('')
          .map(char => char + char)
          .join('')
        : normalizedHex
    if (expandedHex.length !== 6 || !/^[0-9a-f]{6}$/i.test(expandedHex)) {
      console.warn(`Failed to hexToRgb: ${hex}`)
      return { r: 0, g: 0, b: 0 }
    }
    const r = Number.parseInt(expandedHex.slice(0, 2), 16)
    const g = Number.parseInt(expandedHex.slice(2, 4), 16)
    const b = Number.parseInt(expandedHex.slice(4, 6), 16)
    return { r, g, b }
  }

  abstract toRGB(theme?: Theme): RGB

  toRGBA(theme?: Theme): RGBA {
    return {
      ...this.toRGB(theme),
      a: this.a,
    }
  }

  toRGBAString(theme?: Theme): string {
    const { r, g, b, a } = this.toRGBA(theme)
    return `rgba(${r}, ${g}, ${b}, ${a})`
  }
}
