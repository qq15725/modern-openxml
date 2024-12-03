import type { SlideId } from './SlideId'
import { defineChildren, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slideidlist
 */
@defineElement('sldIdLst', 'p')
export class SlideIdList extends OXML {
  @defineChildren('sldId') declare children: SlideId[]
}
