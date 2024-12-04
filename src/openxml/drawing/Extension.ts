import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.extension
 */
@defineElement('a:ext')
export class Extension extends OXML {
  @defineAttribute('uri', 'string') declare uri: string
}
