import type { ExtensionList } from './ExtensionList'
import { defineAttribute, defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.viewproperties
 */
@defineElement('p:viewPr')
export class ViewProperties extends OXML {
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
  @defineChild('p:gridSpacing') declare gridSpacing?: OXML
  @defineChild('p:normalViewPr') declare normalViewPr?: OXML
  @defineChild('p:notesTextViewPr') declare notesTextViewPr?: OXML
  @defineChild('p:notesViewPr') declare notesViewPr?: OXML
  @defineChild('p:outlineViewPr') declare outlineViewPr?: OXML
  @defineChild('p:slideViewPr') declare slideViewPr?: OXML
  @defineChild('p:sorterViewPr') declare sorterViewPr?: OXML
}
