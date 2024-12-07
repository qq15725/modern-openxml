import type { NotesMasterId, NotesMasterIdJSON } from './NotesMasterId'
import { defineChildren, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.notesmasteridlist
 */
@defineElement('p:notesMasterIdLst')
export class NotesMasterIdList extends OXML {
  @defineChildren('p:notesMasterId') declare children: NotesMasterId[]

  override toJSON(): NotesMasterIdJSON[] {
    return this.children.map(child => child.toJSON())
  }
}
