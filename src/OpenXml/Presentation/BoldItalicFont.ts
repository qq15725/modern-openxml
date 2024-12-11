import { defineAttribute, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.bolditalicfont
 */
@defineElement('p:boldItalic')
export class BoldItalicFont extends OOXML {
  @defineAttribute('r:id') declare rId?: string
}
