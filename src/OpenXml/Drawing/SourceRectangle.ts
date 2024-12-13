import { defineAttribute, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.sourcerectangle
 */
@defineElement('a:srcRect')
export class SourceRectangle extends OOXML {
  @defineAttribute('b', 'ST_Percentage') declare b?: number
  @defineAttribute('l', 'ST_Percentage') declare l?: number
  @defineAttribute('t', 'ST_Percentage') declare t?: number
  @defineAttribute('r', 'ST_Percentage') declare r?: number
}
