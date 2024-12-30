import { defineAttribute, defineElement, OOXML } from '../../core'

export interface IDOCSlideLayoutId {
  id: string
  rId: string
}

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slidelayoutid
 */
@defineElement('p:sldLayoutId')
export class SlideLayoutId extends OOXML {
  @defineAttribute('id', { isProperty: true }) declare id: string
  @defineAttribute('r:id', { isProperty: true }) declare rId: string
}
