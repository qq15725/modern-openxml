import type { SchemeColor } from './SchemeColor'
import type { SrgbClr } from './SrgbClr'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.solidfill
 */
@defineElement('solidFill', 'a')
export class SolidFill extends OXML {
  @defineChild('srgbClr') srgbClr?: SrgbClr
  @defineChild('schemeClr') schemeClr?: SchemeColor
}
