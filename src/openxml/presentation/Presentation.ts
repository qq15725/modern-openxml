import { defineChild } from '../../core'
import { _Namespace } from './_Namespace'
import { DefaultTextStyle } from './DefaultTextStyle'
import { NotesSize } from './NotesSize'
import { SlideIdList } from './SlideIdList'
import { SlideMasterIdList } from './SlideMasterIdList'
import { SlideSize } from './SlideSize'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.presentation
 */
export class Presentation extends _Namespace {
  readonly tag = 'presentation'

  attrs = {
    'xmlns': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'xmlns:a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'xmlns:p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'xmlns:r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
    'xmlns:sh': 'http://schemas.openxmlformats.org/officeDocument/2006/sharedTypes',
    'xmlns:xml': 'http://www.w3.org/XML/1998/namespace',
    'conformance': 'transitional',
  }

  @defineChild('p:sldMasterIdLst', SlideMasterIdList) declare sldMasterIdLst: SlideMasterIdList
  @defineChild('p:sldIdLst', SlideIdList) declare sldIdLst: SlideIdList
  @defineChild('p:sldSz', SlideSize) declare sldSz: SlideSize
  @defineChild('p:notesSz', NotesSize) declare notesSz: NotesSize
  @defineChild('p:defaultTextStyle', DefaultTextStyle) declare defaultTextStyle: DefaultTextStyle
}
