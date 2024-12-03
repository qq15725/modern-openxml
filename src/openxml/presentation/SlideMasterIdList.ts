import type { SlideMasterId } from './SlideMasterId'
import { defineChildren, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slidemasteridlist
 */
@defineElement('sldMasterIdLst', 'p')
export class SlideMasterIdList extends OXML {
  @defineChildren('sldMasterId') declare children: SlideMasterId[]
}
