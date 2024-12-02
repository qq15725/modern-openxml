import { defineNode, defineProperty, XmlObject } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.placeholdershape
 */
@defineNode('ph', 'p')
export class PlaceholderShape extends XmlObject {
  @defineProperty('type', 'string') type?: string
  @defineProperty('idx', 'number') idx?: number
}
