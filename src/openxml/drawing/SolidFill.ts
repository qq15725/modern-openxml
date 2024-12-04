import type { SchemeColor } from './SchemeColor'
import type { SrgbClr } from './SrgbClr'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.solidfill
 */
@defineElement('a:solidFill')
export class SolidFill extends OXML {
  @defineChild('a:srgbClr') srgbClr?: SrgbClr
  @defineChild('a:schemeClr') schemeClr?: SchemeColor
}
