import { defineAttribute, defineElement, OOXML } from '../../core'

export interface SlideIdJSON {
  id: string
  rId: string
}

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slideid
 */
@defineElement('p:sldId')
export class SlideId extends OOXML {
  @defineAttribute('id', { isProperty: true }) declare id: string
  @defineAttribute('r:id', { isProperty: true }) declare rId: string
}
