import { defineAttribute, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.extension
 */
@defineElement('a:ext')
export class Extension extends OOXML {
  @defineAttribute('uri') declare uri: string
}
