import type { DefaultTextStyle } from './DefaultTextStyle'
import type { EmbeddedFontList } from './EmbeddedFontList'
import type { NotesSize } from './NotesSize'
import type { SlideIdList } from './SlideIdList'
import type { SlideMasterIdList } from './SlideMasterIdList'
import type { SlideSize } from './SlideSize'
import { defineChild, defineElement, OXML } from '../../core'

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

  @defineChild('p:custDataLst') custDataLst?: OXML
  @defineChild('p:custShowLst') custShowLst?: OXML
  @defineChild('p:defaultTextStyle') declare defaultTextStyle: DefaultTextStyle
  @defineChild('p:embeddedFontLst') embeddedFontLst?: EmbeddedFontList
  @defineChild('p:extLst') extLst?: OXML
  @defineChild('p:handoutMasterIdLst') handoutMasterIdLst?: OXML
  @defineChild('p:kinsoku') kinsoku?: OXML
  @defineChild('p:modifyVerifier') modifyVerifier?: OXML
  @defineChild('p:notesMasterIdLst') notesMasterIdLst?: OXML
  @defineChild('p:notesSz') notesSz?: NotesSize
  @defineChild('p:photoAlbum') photoAlbum?: OXML
  @defineChild('p:sldIdLst') declare sldIdLst: SlideIdList
  @defineChild('p:sldMasterIdLst') declare sldMasterIdLst: SlideMasterIdList
  @defineChild('p:sldSz') declare sldSz: SlideSize
  @defineChild('p:smartTags') smartTags?: OXML
}
