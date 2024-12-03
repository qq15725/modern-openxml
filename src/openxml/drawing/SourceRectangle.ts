import { defineElement, defineProperty, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.sourcerectangle
 */
@defineElement('srcRect', 'a')
export class SourceRectangle extends OXML {
  @defineProperty('b', 'rate') declare b: number
  @defineProperty('l', 'rate') declare l: number
  @defineProperty('r', 'rate') declare r: number
  @defineProperty('t', 'rate') declare t: number
}
