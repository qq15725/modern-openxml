import type { SlideId } from './SlideId'
import { defineChildren, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slideidlist
 */
@defineElement('p:sldIdLst')
export class SlideIdList extends OOXML {
  @defineChildren('p:sldId') declare children: SlideId[]
}
