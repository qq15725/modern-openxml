import { defineNode, defineProperty, XmlObject } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slidemasterid
 */
@defineNode('sldMasterId', 'p')
export class SlideMasterId extends XmlObject {
  @defineProperty('id', 'string') declare id: string
  @defineProperty('r:id', 'string') declare rId: string
}
