import type { IDOCSlideLayoutId, SlideLayoutId } from './SlideLayoutId'
import { defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slidelayoutidlist
 */
@defineElement('p:sldLayoutIdLst')
export class SlideLayoutIdList extends OOXML {
  override get children(): SlideLayoutId[] {
    return super.children.filter(child => child.tag === 'sldLayoutId') as any[]
  }

  override toIDOC(): IDOCSlideLayoutId[] {
    return this.children.map(child => child.toIDOC())
  }
}
