import { defineAttribute, defineElement, defineProperty, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.placeholdershape
 */
@defineElement('p:ph')
export class PlaceholderShape extends OXML {
  @defineAttribute('type', { isProperty: true }) declare type?: string
  @defineAttribute('idx') declare idx?: string

  @defineProperty('idx') declare index?: string
}
