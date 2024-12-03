import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.schemecolor
 */
@defineElement('schemeClr', 'a')
export class SchemeColor extends OXML {
  @defineAttribute('val') declare val: string
}
