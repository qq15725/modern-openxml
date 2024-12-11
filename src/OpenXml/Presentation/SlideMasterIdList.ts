import type { SlideMasterId, SlideMasterIdJSON } from './SlideMasterId'
import { defineChildren, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slidemasteridlist
 */
@defineElement('p:sldMasterIdLst')
export class SlideMasterIdList extends OOXML {
  @defineChildren('p:sldMasterId') declare children: SlideMasterId[]

  override toJSON(): SlideMasterIdJSON[] {
    return this.children.map(child => child.toJSON())
  }
}
