import { defineElement, defineProperty, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.placeholdershape
 */
@defineElement('ph', 'p')
export class PlaceholderShape extends OXML {
  @defineProperty('type', 'string') type?: string
  @defineProperty('idx', 'number') idx?: number
}
