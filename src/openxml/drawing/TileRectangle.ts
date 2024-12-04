import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.transform2d
 */
@defineElement('a:tileRect')
export class TileRectangle extends OXML {
  @defineAttribute('b', 'percentage') declare b: number
  @defineAttribute('l', 'percentage') declare l: number
  @defineAttribute('t', 'percentage') declare t: number
  @defineAttribute('r', 'percentage') declare r: number
}
