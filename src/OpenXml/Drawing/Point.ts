import { defineAttribute, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.point
 */
@defineElement('a:pt')
export class Point extends OOXML {
  @defineAttribute('x') declare x: string
  @defineAttribute('y') declare y: string
}
