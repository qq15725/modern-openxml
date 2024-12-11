import { defineAttribute, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.boldfont
 */
@defineElement('p:bold')
export class BoldFont extends OOXML {
  @defineAttribute('r:id') declare rId?: string
}
