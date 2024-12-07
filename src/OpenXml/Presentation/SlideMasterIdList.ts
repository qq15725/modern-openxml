import type { SlideMasterId } from './SlideMasterId'
import { defineChildren, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slidemasteridlist
 */
@defineElement('p:sldMasterIdLst')
export class SlideMasterIdList extends OXML {
  @defineChildren('p:sldMasterId') declare children: SlideMasterId[]
}
