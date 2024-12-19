import type { EmbeddedFont } from './EmbeddedFont'
import { defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.embeddedfontlist
 */
@defineElement('p:embeddedFontLst')
export class EmbeddedFontList extends OOXML {
  override get children(): EmbeddedFont[] {
    return super.children.filter(child => child.tag === 'embeddedFont') as any[]
  }
}
