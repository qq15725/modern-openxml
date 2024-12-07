import type { SlideId, SlideIdJSON } from './SlideId'
import { defineChildren, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slideidlist
 */
@defineElement('p:sldIdLst')
export class SlideIdList extends OXML {
  @defineChildren('p:sldId') declare children: SlideId[]

  override toJSON(): SlideIdJSON[] {
    return this.children.map(child => child.toJSON())
  }
}
