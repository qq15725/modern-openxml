import { defineAttribute, defineElement, OXML } from '../../core'

export interface NotesMasterIdJSON {
  id: string
  rId: string
}

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.notesmasterid
 */
@defineElement('p:notesMasterId')
export class NotesMasterId extends OXML {
  @defineAttribute('id', { isProperty: true }) declare id: string
  @defineAttribute('r:id', { isProperty: true }) declare rId: string
}
