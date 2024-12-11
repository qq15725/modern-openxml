import type { ExtensionList } from './ExtensionList'
import { defineAttribute, defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.viewproperties
 */
@defineElement('p:viewPr')
export class ViewProperties extends OOXML {
  attrs = {
    'xmlns': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'xmlns:a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'xmlns:p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'xmlns:r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
    'xmlns:sh': 'http://schemas.openxmlformats.org/officeDocument/2006/sharedTypes',
    'xmlns:xml': 'http://www.w3.org/XML/1998/namespace',
  }

  @defineAttribute('lastView', 'ST_ViewType') declare lastView?: string
  @defineAttribute('showComments', 'boolean') declare showComments?: boolean

  @defineChild('p:extLst') declare extLst?: ExtensionList
  @defineChild('p:gridSpacing') declare gridSpacing?: OOXML
  @defineChild('p:normalViewPr') declare normalViewPr?: OOXML
  @defineChild('p:notesTextViewPr') declare notesTextViewPr?: OOXML
  @defineChild('p:notesViewPr') declare notesViewPr?: OOXML
  @defineChild('p:outlineViewPr') declare outlineViewPr?: OOXML
  @defineChild('p:slideViewPr') declare slideViewPr?: OOXML
  @defineChild('p:sorterViewPr') declare sorterViewPr?: OOXML
}
