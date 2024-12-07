import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.boldfont
 */
@defineElement('p:bold')
export class BoldFont extends OXML {
  @defineAttribute('r:id') declare rId?: string
}
