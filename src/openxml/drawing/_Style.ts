import type { DefaultParagraphProperties } from './DefaultParagraphProperties'
import type { ExtensionList } from './ExtensionList'
import { defineChild, OXML } from '../../core'

export class _Style extends OXML {
  @defineChild('a:defPPr') declare defPPr?: DefaultParagraphProperties
  @defineChild('a:extLst') declare extLst?: ExtensionList
  @defineChild('a:lvl1pPr') declare lvl1pPr?: OXML
  @defineChild('a:lvl2pPr') declare lvl2pPr?: OXML
  @defineChild('a:lvl3pPr') declare lvl3pPr?: OXML
  @defineChild('a:lvl4pPr') declare lvl4pPr?: OXML
  @defineChild('a:lvl5pPr') declare lvl5pPr?: OXML
  @defineChild('a:lvl6pPr') declare lvl6pPr?: OXML
  @defineChild('a:lvl7pPr') declare lvl7pPr?: OXML
  @defineChild('a:lvl8pPr') declare lvl8pPr?: OXML
  @defineChild('a:lvl9pPr') declare lvl9pPr?: OXML
}
