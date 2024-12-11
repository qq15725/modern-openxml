import type { EmbeddedFont } from './EmbeddedFont'
import { defineChildren, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.embeddedfontlist
 */
@defineElement('p:embeddedFontLst')
export class EmbeddedFontList extends OOXML {
  @defineChildren('p:embeddedFont') declare children: EmbeddedFont[]
}
