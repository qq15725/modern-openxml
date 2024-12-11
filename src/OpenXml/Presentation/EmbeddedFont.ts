import type { BoldFont } from './BoldFont'
import type { BoldItalicFont } from './BoldItalicFont'
import type { Font } from './Font'
import type { ItalicFont } from './ItalicFont'
import type { RegularFont } from './RegularFont'
import { defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.embeddedfont
 */
@defineElement('p:embeddedFont')
export class EmbeddedFont extends OOXML {
  @defineChild('p:bold') declare bold?: BoldFont
  @defineChild('p:boldItalic') declare boldItalic?: BoldItalicFont
  @defineChild('p:font') declare font: Font
  @defineChild('p:italic') declare italic?: ItalicFont
  @defineChild('p:regular') declare regular?: RegularFont
}
