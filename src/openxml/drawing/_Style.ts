import type { DefaultParagraphProperties } from './DefaultParagraphProperties'
import type { ExtensionList } from './ExtensionList'
import { defineChild, OXML } from '../../core'

export class _Style extends OXML {
  @defineChild('a:defPPr') defPPr?: DefaultParagraphProperties
  @defineChild('a:extLst') extLst?: ExtensionList
  @defineChild('a:lvl1pPr') lvl1pPr?: OXML
  @defineChild('a:lvl2pPr') lvl2pPr?: OXML
  @defineChild('a:lvl3pPr') lvl3pPr?: OXML
  @defineChild('a:lvl4pPr') lvl4pPr?: OXML
  @defineChild('a:lvl5pPr') lvl5pPr?: OXML
  @defineChild('a:lvl6pPr') lvl6pPr?: OXML
  @defineChild('a:lvl7pPr') lvl7pPr?: OXML
  @defineChild('a:lvl8pPr') lvl8pPr?: OXML
  @defineChild('a:lvl9pPr') lvl9pPr?: OXML
}
