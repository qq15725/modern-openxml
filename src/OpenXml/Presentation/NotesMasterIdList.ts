import type { NotesMasterId } from './NotesMasterId'
import { defineChildren, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.notesmasteridlist
 */
@defineElement('p:notesMasterIdLst')
export class NotesMasterIdList extends OOXML {
  @defineChildren('p:notesMasterId') declare children: NotesMasterId[]
}
