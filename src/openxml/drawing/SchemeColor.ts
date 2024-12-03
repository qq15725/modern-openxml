import { defineElement, defineProperty, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.schemecolor
 */
@defineElement('schemeClr', 'a')
export class SchemeColor extends OXML {
  @defineProperty('val', 'string') declare val: string
}
