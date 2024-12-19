import type { SlideMasterId } from './SlideMasterId'
import { defineChildren, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slidemasteridlist
 */
@defineElement('p:sldMasterIdLst')
export class SlideMasterIdList extends OOXML {
  @defineChildren('p:sldMasterId') declare children: SlideMasterId[]
}
