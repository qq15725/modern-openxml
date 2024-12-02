import { defineNode, defineProperty, XmlObject } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.tile
 */
@defineNode('tile', 'a')
export class Tile extends XmlObject {
  @defineProperty('sx', 'rate') declare sx: number
  @defineProperty('sy', 'rate') declare sy: number
  @defineProperty('tx', 'rate') declare tx: number
  @defineProperty('ty', 'rate') declare ty: number
  @defineProperty('algn', 'string') declare algn: string
  @defineProperty('flip', 'string') declare flip: string
}
