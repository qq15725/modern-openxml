import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.systemcolor
 */
@defineElement('a:sysClr')
export class SystemColor extends OXML {
  @defineAttribute('val') declare val: string
}
