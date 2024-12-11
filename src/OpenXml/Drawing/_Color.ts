import type { HslColor } from './HslColor'
import type { PresetColor } from './PresetColor'
import type { RgbColorModelHex } from './RgbColorModelHex'
import type { RgbColorModelPercentage } from './RgbColorModelPercentage'
import type { SchemeColor } from './SchemeColor'
import type { SystemColor } from './SystemColor'
import { defineChild, OOXML } from '../../core'

export class _Color extends OOXML {
  @defineChild('a:hslClr') declare hslClr?: HslColor
  @defineChild('a:prstClr') declare prstClr?: PresetColor
  @defineChild('a:schemeClr') declare schemeClr?: SchemeColor
  @defineChild('a:scrgbClr') declare scrgbClr?: RgbColorModelPercentage
  @defineChild('a:srgbClr') declare srgbClr?: RgbColorModelHex
  @defineChild('a:sysClr') declare sysClr?: SystemColor

  get color(): string | undefined {
    return this.hslClr?.color
      ?? this.prstClr?.color
      ?? this.schemeClr?.color
      ?? this.scrgbClr?.color
      ?? this.srgbClr?.color
      ?? this.sysClr?.color
  }

  toJSON(): any {
    return this.color
  }
}
