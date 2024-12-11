import type { NotesMasterId, NotesMasterIdJSON } from './NotesMasterId'
import { defineChildren, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.notesmasteridlist
 */
@defineElement('p:notesMasterIdLst')
export class NotesMasterIdList extends OOXML {
  @defineChildren('p:notesMasterId') declare children: NotesMasterId[]

  override toJSON(): NotesMasterIdJSON[] {
    return this.children.map(child => child.toJSON())
  }
}
