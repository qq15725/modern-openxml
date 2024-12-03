import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.sourcerectangle
 */
@defineElement('srcRect', 'a')
export class SourceRectangle extends OXML {
  @defineAttribute('b', 'rate') declare b: number
  @defineAttribute('l', 'rate') declare l: number
  @defineAttribute('r', 'rate') declare r: number
  @defineAttribute('t', 'rate') declare t: number
}
