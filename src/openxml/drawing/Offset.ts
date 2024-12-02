import { defineNode, defineProperty, XmlObject } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.offset
 */
@defineNode('off', 'a')
export class Offset extends XmlObject {
  @defineProperty('x', 'emu') declare x: number
  @defineProperty('y', 'emu') declare y: number
}
