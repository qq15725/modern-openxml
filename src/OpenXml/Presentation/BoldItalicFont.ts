import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.bolditalicfont
 */
@defineElement('p:boldItalic')
export class BoldItalicFont extends OXML {
  @defineAttribute('r:id') declare rId?: string
}
