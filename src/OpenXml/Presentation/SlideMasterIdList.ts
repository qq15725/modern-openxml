import type { SlideMasterId } from './SlideMasterId'
import { defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slidemasteridlist
 */
@defineElement('p:sldMasterIdLst')
export class SlideMasterIdList extends OOXML {
  override get children(): SlideMasterId[] {
    return super.children.filter(child => child.tag === 'sldMasterId') as any[]
  }
}
