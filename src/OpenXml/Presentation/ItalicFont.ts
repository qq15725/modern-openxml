import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.italicfont
 */
@defineElement('p:italic')
export class ItalicFont extends OXML {
  @defineAttribute('r:id') declare rId?: string
}
