import type { HslColor } from './HslColor'
import type { PresetColor } from './PresetColor'
import type { RgbColorModelHex } from './RgbColorModelHex'
import type { RgbColorModelPercentage } from './RgbColorModelPercentage'
import type { SchemeColor } from './SchemeColor'
import type { SystemColor } from './SystemColor'
import { defineChild, OOXML } from '../../core'

export type Color =
  | HslColor
  | PresetColor
  | SchemeColor
  | RgbColorModelPercentage
  | RgbColorModelHex
  | SystemColor

export abstract class _ColorStyle extends OOXML {
  @defineChild('a:hslClr') declare hslClr?: HslColor
  @defineChild('a:prstClr') declare prstClr?: PresetColor
  @defineChild('a:schemeClr') declare schemeClr?: SchemeColor
  @defineChild('a:scrgbClr') declare scrgbClr?: RgbColorModelPercentage
  @defineChild('a:srgbClr') declare srgbClr?: RgbColorModelHex
  @defineChild('a:sysClr') declare sysClr?: SystemColor

  get color(): Color | undefined {
    return this.hslClr
      ?? this.prstClr
      ?? this.schemeClr
      ?? this.scrgbClr
      ?? this.srgbClr
      ?? this.sysClr
  }

  get rgbaString(): string {
    return this.color?.toRGBAString() ?? '#000000'
  }
}
