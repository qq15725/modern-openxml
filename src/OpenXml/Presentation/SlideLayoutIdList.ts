import type { SlideLayoutId, SlideLayoutIdJSON } from './SlideLayoutId'
import { defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slidelayoutidlist
 */
@defineElement('p:sldLayoutIdLst')
export class SlideLayoutIdList extends OOXML {
  override get children(): SlideLayoutId[] {
    return super.children.filter(child => child.tag === 'sldLayoutId') as any[]
  }

  override toJSON(): SlideLayoutIdJSON[] {
    return this.children.map(child => child.toJSON())
  }
}
