import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.point
 */
@defineElement('a:pt')
export class Point extends OXML {
  @defineAttribute('x') declare x: string
  @defineAttribute('y') declare y: string
}
