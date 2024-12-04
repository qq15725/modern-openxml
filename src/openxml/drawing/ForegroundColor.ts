import type { HslColor } from './HslColor'
import type { PresetColor } from './PresetColor'
import type { RgbColorModelHex } from './RgbColorModelHex'
import type { RgbColorModelPercentage } from './RgbColorModelPercentage'
import type { SchemeColor } from './SchemeColor'
import type { SystemColor } from './SystemColor'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.foregroundcolor
 */
@defineElement('a:fgClr')
export class ForegroundColor extends OXML {
  @defineChild('a:hslClr') hslClr?: HslColor
  @defineChild('a:prstClr') prstClr?: PresetColor
  @defineChild('a:schemeClr') schemeClr?: SchemeColor
  @defineChild('a:scrgbClr') scrgbClr?: RgbColorModelPercentage
  @defineChild('a:srgbClr') srgbClr?: RgbColorModelHex
  @defineChild('a:sysClr') sysClr?: SystemColor
}
