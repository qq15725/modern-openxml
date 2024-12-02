import { defineChild, defineNode, XmlObject } from '../../core'
import { SchemeColor } from './SchemeColor'
import { SrgbClr } from './SrgbClr'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.solidfill
 */
@defineNode('solidFill', 'a')
export class SolidFill extends XmlObject {
  @defineChild('a:srgbClr', SrgbClr) srgbClr?: SrgbClr
  @defineChild('a:schemeClr', SchemeColor) schemeClr?: SchemeColor
}
