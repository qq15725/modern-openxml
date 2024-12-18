import type { ColorMap } from './ColorMap'
import type { ColorScheme } from './ColorScheme'
import { defineChild, defineElement, OOXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.extracolorscheme
 */
@defineElement('a:extraClrScheme')
export class ExtraColorScheme extends OOXML {
  @defineChild('a:clrMap') declare clrMap?: ColorMap
  @defineChild('a:clrScheme') declare clrScheme?: ColorScheme
}
