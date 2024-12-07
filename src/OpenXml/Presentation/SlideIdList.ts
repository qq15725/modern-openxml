import type { SlideId } from './SlideId'
import { defineChildren, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slideidlist
 */
@defineElement('p:sldIdLst')
export class SlideIdList extends OXML {
  @defineChildren('p:sldId') declare children: SlideId[]
}
