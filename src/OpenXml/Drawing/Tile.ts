import { defineAttribute, defineElement, OOXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.tile
 */
@defineElement('a:tile')
export class Tile extends OOXML {
  @defineAttribute('sx', 'ST_Percentage') declare sx?: number
  @defineAttribute('sy', 'ST_Percentage') declare sy?: number
  @defineAttribute('tx', 'ST_Coordinate') declare tx?: number
  @defineAttribute('ty', 'ST_Coordinate') declare ty?: number
  @defineAttribute('algn', 'ST_RectAlignment') declare algn?: string
  @defineAttribute('flip', 'ST_TileFlipMode') declare flip?: string
}
