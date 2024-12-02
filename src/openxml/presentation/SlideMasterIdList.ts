import { defineChild, defineNode, XmlObject } from '../../core'
import { SlideMasterId } from './SlideMasterId'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slidemasteridlist
 */
@defineNode('sldMasterIdLst', 'p')
export class SlideMasterIdList extends XmlObject {
  @defineChild('p:sldMasterId', SlideMasterId, true) declare children: SlideMasterId[]
}
