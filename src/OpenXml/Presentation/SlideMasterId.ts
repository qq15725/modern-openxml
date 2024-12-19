import { defineAttribute, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slidemasterid
 */
@defineElement('p:sldMasterId')
export class SlideMasterId extends OOXML {
  @defineAttribute('id') declare id: string
  @defineAttribute('r:id') declare rId: string
}
