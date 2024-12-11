import type { ExtensionList } from '../Drawing'
import { defineAttribute, defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.nonvisualdrawingproperties
 */
@defineElement('p:cNvPr')
export class NonVisualDrawingProperties extends OOXML {
  @defineAttribute('id') declare id?: string
  @defineAttribute('title') declare title?: string
  @defineAttribute('name') declare name?: string
  @defineAttribute('descr') declare descr?: string
  @defineAttribute('hidden') declare hidden?: string

  @defineChild('a:extLst') declare extLst?: ExtensionList
  @defineChild('a:hlinkClick') declare hlinkClick?: OOXML
  @defineChild('a:hlinkHover') declare hlinkHover?: OOXML
}
