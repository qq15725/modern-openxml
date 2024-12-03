import { defineElement, defineProperty, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slidemasterid
 */
@defineElement('sldMasterId', 'p')
export class SlideMasterId extends OXML {
  @defineProperty('id', 'string') declare id: string
  @defineProperty('r:id', 'string') declare rId: string
}
