import { defineAttribute, defineElement, OOXML } from '../../core'

export interface SlideMasterIdJSON {
  id: string
  rId: string
}

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slidemasterid
 */
@defineElement('p:sldMasterId')
export class SlideMasterId extends OOXML {
  @defineAttribute('id', { isProperty: true }) declare id: string
  @defineAttribute('r:id', { isProperty: true }) declare rId: string
}
