import type { SlideLayoutId, SlideLayoutIdJSON } from './SlideLayoutId'
import { defineChildren, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slidelayoutidlist
 */
@defineElement('p:sldLayoutIdLst')
export class SlideLayoutIdList extends OOXML {
  @defineChildren('p:sldLayoutId') declare children: SlideLayoutId[]

  override toJSON(): SlideLayoutIdJSON[] {
    return this.children.map(child => child.toJSON())
  }
}
