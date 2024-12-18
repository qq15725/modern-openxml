import type { DefaultParagraphProperties } from './DefaultParagraphProperties'
import type { ExtensionList } from './ExtensionList'
import type { Level1ParagraphProperties } from './Level1ParagraphProperties'
import type { Level2ParagraphProperties } from './Level2ParagraphProperties'
import type { Level3ParagraphProperties } from './Level3ParagraphProperties'
import type { Level4ParagraphProperties } from './Level4ParagraphProperties'
import type { Level5ParagraphProperties } from './Level5ParagraphProperties'
import type { Level6ParagraphProperties } from './Level6ParagraphProperties'
import type { Level7ParagraphProperties } from './Level7ParagraphProperties'
import type { Level8ParagraphProperties } from './Level8ParagraphProperties'
import type { Level9ParagraphProperties } from './Level9ParagraphProperties'
import { defineChild, OOXML } from '../../core'

export abstract class _TextStyle extends OOXML {
  @defineChild('a:defPPr') declare defPPr?: DefaultParagraphProperties
  @defineChild('a:extLst') declare extLst?: ExtensionList
  @defineChild('a:lvl1pPr') declare lvl1pPr?: Level1ParagraphProperties
  @defineChild('a:lvl2pPr') declare lvl2pPr?: Level2ParagraphProperties
  @defineChild('a:lvl3pPr') declare lvl3pPr?: Level3ParagraphProperties
  @defineChild('a:lvl4pPr') declare lvl4pPr?: Level4ParagraphProperties
  @defineChild('a:lvl5pPr') declare lvl5pPr?: Level5ParagraphProperties
  @defineChild('a:lvl6pPr') declare lvl6pPr?: Level6ParagraphProperties
  @defineChild('a:lvl7pPr') declare lvl7pPr?: Level7ParagraphProperties
  @defineChild('a:lvl8pPr') declare lvl8pPr?: Level8ParagraphProperties
  @defineChild('a:lvl9pPr') declare lvl9pPr?: Level9ParagraphProperties
}
