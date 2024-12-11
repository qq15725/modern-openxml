import { defineAttribute, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.regularfont
 */
@defineElement('p:regular')
export class RegularFont extends OOXML {
  @defineAttribute('r:id') declare rId?: string
}
