import type { NotesMasterId } from './NotesMasterId'
import { defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.notesmasteridlist
 */
@defineElement('p:notesMasterIdLst')
export class NotesMasterIdList extends OOXML {
  override get children(): NotesMasterId[] {
    return super.children.filter(child => child.tag === 'notesMasterId') as any[]
  }
}
