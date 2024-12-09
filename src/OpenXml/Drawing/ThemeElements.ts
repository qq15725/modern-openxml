import type { ColorScheme } from './ColorScheme'
import type { ExtensionList } from './ExtensionList'
import type { FontScheme } from './FontScheme'
import type { FormatScheme } from './FormatScheme'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.themeelements
 */
@defineElement('a:themeElements')
export class ThemeElements extends OXML {
  @defineChild('a:clrScheme') declare clrScheme?: ColorScheme
  @defineChild('a:extLst') declare extLst?: ExtensionList
  @defineChild('a:fmtScheme') declare fmtScheme?: FormatScheme
  @defineChild('a:fontScheme') declare fontScheme?: FontScheme
}
