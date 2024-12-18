import type { ExtraColorScheme } from './ExtraColorScheme'
import { defineChild, defineElement, OOXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.extracolorschemelist
 */
@defineElement('a:extraClrSchemeLst')
export class ExtraColorSchemeList extends OOXML {
  @defineChild('a:extraClrScheme') declare extraClrScheme?: ExtraColorScheme
}
