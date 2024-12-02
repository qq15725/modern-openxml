import { defineChild, defineNode, XmlObject } from '../../core'
import { SlideId } from './SlideId'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slideidlist
 */
@defineNode('sldIdLst', 'p')
export class SlideIdList extends XmlObject {
  @defineChild('p:sldId', SlideId, true) declare children: SlideId[]
}
