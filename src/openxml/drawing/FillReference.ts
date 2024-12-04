import { defineChild, defineElement, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.fillreference
 */
@defineElement('a:fillRef')
export class FillReference extends OXML {
  @defineChild('a:hslClr', OXML) hslClr?: OXML
  @defineChild('a:prstClr', OXML) prstClr?: OXML
  @defineChild('a:schemeClr', OXML) schemeClr?: OXML
  @defineChild('a:scrgbClr', OXML) scrgbClr?: OXML
  @defineChild('a:srgbClr', OXML) srgbClr?: OXML
  @defineChild('a:sysClr', OXML) sysClr?: OXML
}
