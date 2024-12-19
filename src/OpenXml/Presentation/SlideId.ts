import { defineAttribute, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slideid
 */
@defineElement('p:sldId')
export class SlideId extends OOXML {
  @defineAttribute('id') declare id: string
  @defineAttribute('r:id') declare rId: string
}
