import { defineChild, defineElement, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.fontreference
 */
@defineElement('a:fontRef')
export class FontReference extends OXML {
  @defineChild('a:hslClr') hslClr?: OXML
  @defineChild('a:prstClr') prstClr?: OXML
  @defineChild('a:schemeClr') schemeClr?: OXML
  @defineChild('a:scrgbClr') scrgbClr?: OXML
  @defineChild('a:srgbClr') srgbClr?: OXML
  @defineChild('a:sysClr') sysClr?: OXML
}
