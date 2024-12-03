import { defineChild, defineElement, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.linereference
 */
@defineElement('lnRef', 'a')
export class LineReference extends OXML {
  @defineChild('hslClr', OXML) hslClr?: OXML
  @defineChild('prstClr', OXML) prstClr?: OXML
  @defineChild('schemeClr', OXML) schemeClr?: OXML
  @defineChild('scrgbClr', OXML) scrgbClr?: OXML
  @defineChild('srgbClr', OXML) srgbClr?: OXML
  @defineChild('sysClr', OXML) sysClr?: OXML
}
