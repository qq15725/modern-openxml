import { defineChild, defineElement, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.effectreference
 */
@defineElement('a:effectRef')
export class EffectReference extends OXML {
  @defineChild('hslClr') hslClr?: OXML
  @defineChild('prstClr') prstClr?: OXML
  @defineChild('schemeClr') schemeClr?: OXML
  @defineChild('scrgbClr') scrgbClr?: OXML
  @defineChild('srgbClr') srgbClr?: OXML
  @defineChild('sysClr') sysClr?: OXML
}
