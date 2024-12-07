import type { Font } from './Font'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.embeddedfont
 */
@defineElement('p:embeddedFont')
export class EmbeddedFont extends OXML {
  @defineChild('p:bold') declare bold?: OXML
  @defineChild('p:boldItalic') declare boldItalic?: OXML
  @defineChild('p:font') declare font: Font
  @defineChild('p:italic') declare italic?: OXML
  @defineChild('p:regular') declare regular?: OXML
}
