import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.regularfont
 */
@defineElement('p:regular')
export class RegularFont extends OXML {
  @defineAttribute('r:id') declare rId?: string
}
