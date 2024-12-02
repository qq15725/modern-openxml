import { defineNode, defineProperty, XmlObject } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.extents
 */
@defineNode('off', 'a')
export class Extents extends XmlObject {
  @defineProperty('cx', 'emu') declare cx: number
  @defineProperty('cy', 'emu') declare cy: number
}
