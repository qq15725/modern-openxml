import { defineElement, defineProperty, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slideid
 */
@defineElement('sldId', 'p')
export class SlideId extends OXML {
  @defineProperty('id', 'string') declare id: string
  @defineProperty('r:id', 'string') declare rId: string
}
