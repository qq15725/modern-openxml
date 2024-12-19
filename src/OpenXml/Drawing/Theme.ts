import type { CustomColorList } from './CustomColorList'
import type { ExtensionList } from './ExtensionList'
import type { ExtraColorSchemeList } from './ExtraColorSchemeList'
import type { ObjectDefaults } from './ObjectDefaults'
import type { ThemeElements } from './ThemeElements'
import { defineChild, defineElement, OOXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.theme
 */
@defineElement('a:theme')
export class Theme extends OOXML {
  path?: string

  attrs = {
    'xmlns:a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'name': 'Office Theme',
  }

  @defineChild('a:custClrLst') declare custClrLst?: CustomColorList
  @defineChild('a:extLst') declare extLst?: ExtensionList
  @defineChild('a:extraClrSchemeLst') declare extraClrSchemeLst?: ExtraColorSchemeList
  @defineChild('a:objectDefaults') declare objectDefaults?: ObjectDefaults
  @defineChild('a:themeElements') declare themeElements?: ThemeElements
}
