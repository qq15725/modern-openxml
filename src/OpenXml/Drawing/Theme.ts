import type { CustomColorList } from './CustomColorList'
import type { ExtensionList } from './ExtensionList'
import type { ThemeElements } from './ThemeElements'
import { defineChild, defineElement, defineProperty, OOXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.theme
 */
@defineElement('a:theme')
export class Theme extends OOXML {
  attrs = {
    'xmlns:a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'name': 'Office Theme',
  }

  @defineChild('a:custClrLst') declare custClrLst?: CustomColorList
  @defineChild('a:extLst') declare extLst?: ExtensionList
  @defineChild('a:extraClrSchemeLst') declare extraClrSchemeLst?: OOXML
  @defineChild('a:objectDefaults') declare objectDefaults?: OOXML
  @defineChild('a:themeElements') declare themeElements?: ThemeElements

  @defineProperty('custClrLst') declare customColors?: any
  @defineProperty('themeElements.clrScheme') declare colors?: any
  @defineProperty('themeElements.fontScheme.majorFont') declare majorFonts?: any
  @defineProperty('themeElements.fontScheme.minorFont') declare minorFonts?: any
  @defineProperty('themeElements.fmtScheme.fillStyleLst.children') declare fills?: any[]
  @defineProperty('themeElements.fmtScheme.lnStyleLst.children') declare outlines?: any[]
  @defineProperty('themeElements.fmtScheme.effectStyleLst.children') declare effects?: any[]
  @defineProperty('themeElements.fmtScheme.bgFillStyleLst.children') declare backgroundFills?: any
}
