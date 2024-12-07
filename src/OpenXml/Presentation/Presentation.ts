import type { DefaultTextStyle } from './DefaultTextStyle'
import type { EmbeddedFontList } from './EmbeddedFontList'
import type { ExtensionList } from './ExtensionList'
import type { NotesMasterIdJSON } from './NotesMasterId'
import type { NotesMasterIdList } from './NotesMasterIdList'
import type { NotesSize } from './NotesSize'
import type { SlideIdJSON } from './SlideId'
import type { SlideIdList } from './SlideIdList'
import type { SlideMasterIdJSON } from './SlideMasterId'
import type { SlideMasterIdList } from './SlideMasterIdList'
import type { SlideSize } from './SlideSize'
import { defineChild, defineElement, defineProperty, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.presentation
 */
@defineElement('p:presentation')
export class Presentation extends OXML {
  attrs = {
    'xmlns': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'xmlns:a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'xmlns:p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'xmlns:r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
    'xmlns:sh': 'http://schemas.openxmlformats.org/officeDocument/2006/sharedTypes',
    'xmlns:xml': 'http://www.w3.org/XML/1998/namespace',
    'conformance': 'transitional',
  }

  @defineChild('p:custDataLst') declare custDataLst?: OXML
  @defineChild('p:custShowLst') declare custShowLst?: OXML
  @defineChild('p:defaultTextStyle') declare defaultTextStyle: DefaultTextStyle
  @defineChild('p:embeddedFontLst') declare embeddedFontLst?: EmbeddedFontList
  @defineChild('p:extLst') declare extLst?: ExtensionList
  @defineChild('p:handoutMasterIdLst') declare handoutMasterIdLst?: OXML
  @defineChild('p:kinsoku') declare kinsoku?: OXML
  @defineChild('p:modifyVerifier') declare modifyVerifier?: OXML
  @defineChild('p:notesMasterIdLst') declare notesMasterIdLst?: NotesMasterIdList
  @defineChild('p:notesSz') declare notesSz?: NotesSize
  @defineChild('p:photoAlbum') declare photoAlbum?: OXML
  @defineChild('p:sldIdLst') declare sldIdLst: SlideIdList
  @defineChild('p:sldMasterIdLst') declare sldMasterIdLst: SlideMasterIdList
  @defineChild('p:sldSz') declare sldSz: SlideSize
  @defineChild('p:smartTags') declare smartTags?: OXML

  @defineProperty('sldSz.cx') declare slideWidth: number
  @defineProperty('sldSz.cy') declare slideHeight: number
  @defineProperty('notesSz.cx') declare notesWidth: number
  @defineProperty('notesSz.cy') declare notesHeight: number
  @defineProperty('sldIdLst') declare slides: SlideIdJSON[]
  @defineProperty('sldMasterIdLst') declare slideMasters: SlideMasterIdJSON[]
  @defineProperty('notesMasterIdLst') declare notesMasters: NotesMasterIdJSON[]
}
