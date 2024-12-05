import type { ExtensionList } from '../drawing'
import { defineAttribute, defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.nonvisualdrawingproperties
 */
@defineElement('p:cNvPr')
export class NonVisualDrawingProperties extends OXML {
  @defineAttribute('id') declare id?: string
  @defineAttribute('title') declare title?: string
  @defineAttribute('name') declare name?: string
  @defineAttribute('descr') declare descr?: string
  @defineAttribute('hidden') declare hidden?: string

  @defineChild('a:extLst') declare extLst?: ExtensionList
  @defineChild('a:hlinkClick') declare hlinkClick?: OXML
  @defineChild('a:hlinkHover') declare hlinkHover?: OXML
}
