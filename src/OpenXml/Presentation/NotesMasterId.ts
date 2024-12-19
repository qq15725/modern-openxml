import { defineAttribute, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.notesmasterid
 */
@defineElement('p:notesMasterId')
export class NotesMasterId extends OOXML {
  @defineAttribute('r:id') declare rId: string
}
