import type { DefaultTextStyle } from './DefaultTextStyle'
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

  @defineChild('sldMasterIdLst') declare sldMasterIdLst: SlideMasterIdList
  @defineChild('sldIdLst') declare sldIdLst: SlideIdList
  @defineChild('sldSz') declare sldSz: SlideSize
  @defineChild('notesSz') declare notesSz: NotesSize
  @defineChild('defaultTextStyle') declare defaultTextStyle: DefaultTextStyle
}
