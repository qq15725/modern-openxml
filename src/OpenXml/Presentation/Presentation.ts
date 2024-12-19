import type { DefaultTextStyle } from './DefaultTextStyle'
import type { EmbeddedFontList } from './EmbeddedFontList'
import type { ExtensionList } from './ExtensionList'
import type { NotesMasterIdList } from './NotesMasterIdList'
import type { NotesSize } from './NotesSize'
import type { SlideIdList } from './SlideIdList'
import type { SlideMasterIdList } from './SlideMasterIdList'
import type { SlideSize } from './SlideSize'
import { defineChild, defineElement, defineProperty, OOXML } from '../../core'

export interface PresentationJSON {
  slideWidth: number
  slideHeight: number
}

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.presentation
 */
@defineElement('p:presentation')
export class Presentation extends OOXML {
  attrs = {
    'xmlns': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'xmlns:a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'xmlns:p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'xmlns:r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
    'xmlns:sh': 'http://schemas.openxmlformats.org/officeDocument/2006/sharedTypes',
    'xmlns:xml': 'http://www.w3.org/XML/1998/namespace',
    'conformance': 'transitional',
  }

  @defineChild('p:custDataLst') declare custDataLst?: OOXML
  @defineChild('p:custShowLst') declare custShowLst?: OOXML
  @defineChild('p:defaultTextStyle') declare defaultTextStyle: DefaultTextStyle
  @defineChild('p:embeddedFontLst') declare embeddedFontLst?: EmbeddedFontList
  @defineChild('p:extLst') declare extLst?: ExtensionList
  @defineChild('p:handoutMasterIdLst') declare handoutMasterIdLst?: OOXML
  @defineChild('p:kinsoku') declare kinsoku?: OOXML
  @defineChild('p:modifyVerifier') declare modifyVerifier?: OOXML
  @defineChild('p:notesMasterIdLst') declare notesMasterIdLst?: NotesMasterIdList
  @defineChild('p:notesSz') declare notesSz?: NotesSize
  @defineChild('p:photoAlbum') declare photoAlbum?: OOXML
  @defineChild('p:sldIdLst') declare sldIdLst: SlideIdList
  @defineChild('p:sldMasterIdLst') declare sldMasterIdLst: SlideMasterIdList
  @defineChild('p:sldSz') declare sldSz: SlideSize
  @defineChild('p:smartTags') declare smartTags?: OOXML

  @defineProperty('sldSz.cx') declare slideWidth: number
  @defineProperty('sldSz.cy') declare slideHeight: number

  override toJSON(): PresentationJSON {
    return super.toJSON()
  }
}
