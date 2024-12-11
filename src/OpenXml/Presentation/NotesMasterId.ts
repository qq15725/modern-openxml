import { defineAttribute, defineElement, OOXML } from '../../core'

export interface NotesMasterIdJSON {
  id: string
  rId: string
}

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.notesmasterid
 */
@defineElement('p:notesMasterId')
export class NotesMasterId extends OOXML {
  @defineAttribute('r:id', { isProperty: true }) declare rId: string
}
