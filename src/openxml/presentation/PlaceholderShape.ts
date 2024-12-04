import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.placeholdershape
 */
@defineElement('p:ph')
export class PlaceholderShape extends OXML {
  @defineAttribute('type') type?: string
  @defineAttribute('idx', 'number') idx?: number
}
