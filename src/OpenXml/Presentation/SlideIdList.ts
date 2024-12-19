import type { SlideId } from './SlideId'
import { defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slideidlist
 */
@defineElement('p:sldIdLst')
export class SlideIdList extends OOXML {
  override get children(): SlideId[] {
    return super.children.filter(child => child.tag === 'sldId') as any[]
  }
}
