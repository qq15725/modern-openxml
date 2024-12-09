import { defineAttribute, defineElement, OXML } from '../../core'

export interface SlideLayoutIdJSON {
  id: string
  rId: string
}

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slidelayoutid
 */
@defineElement('p:sldLayoutId')
export class SlideLayoutId extends OXML {
  @defineAttribute('id', { isProperty: true }) declare id: string
  @defineAttribute('r:id', { isProperty: true }) declare rId: string
}
