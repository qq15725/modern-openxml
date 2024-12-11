import { defineAttribute, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.italicfont
 */
@defineElement('p:italic')
export class ItalicFont extends OOXML {
  @defineAttribute('r:id') declare rId?: string
}
