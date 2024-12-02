import { defineNode, defineProperty, XmlObject } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.sourcerectangle
 */
@defineNode('srcRect', 'a')
export class SourceRectangle extends XmlObject {
  @defineProperty('b', 'rate') declare b: number
  @defineProperty('l', 'rate') declare l: number
  @defineProperty('r', 'rate') declare r: number
  @defineProperty('t', 'rate') declare t: number
}
