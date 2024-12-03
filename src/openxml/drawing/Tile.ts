import { defineElement, defineProperty, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.tile
 */
@defineElement('tile', 'a')
export class Tile extends OXML {
  @defineProperty('sx', 'rate') declare sx: number
  @defineProperty('sy', 'rate') declare sy: number
  @defineProperty('tx', 'rate') declare tx: number
  @defineProperty('ty', 'rate') declare ty: number
  @defineProperty('algn', 'string') declare algn: string
  @defineProperty('flip', 'string') declare flip: string
}
