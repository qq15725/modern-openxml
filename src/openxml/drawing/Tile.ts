import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.tile
 */
@defineElement('a:tile')
export class Tile extends OXML {
  @defineAttribute('sx', 'rate') declare sx: number
  @defineAttribute('sy', 'rate') declare sy: number
  @defineAttribute('tx', 'rate') declare tx: number
  @defineAttribute('ty', 'rate') declare ty: number
  @defineAttribute('algn') declare algn: string
  @defineAttribute('flip') declare flip: string
}
