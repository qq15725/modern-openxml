import type { ExtensionList } from '../drawing'
import { defineAttribute, defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.nonvisualdrawingproperties
 */
@defineElement('p:cNvPr')
export class NonVisualDrawingProperties extends OXML {
  @defineAttribute('id') id?: string
  @defineAttribute('title') title?: string
  @defineAttribute('name') name?: string
  @defineAttribute('descr') descr?: string
  @defineAttribute('hidden') hidden?: string

  @defineChild('a:extLst') extLst?: ExtensionList
  @defineChild('a:hlinkClick') hlinkClick?: OXML
  @defineChild('a:hlinkHover') hlinkHover?: OXML
}
