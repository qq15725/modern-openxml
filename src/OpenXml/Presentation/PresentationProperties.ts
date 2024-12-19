import type { ColorMostRecentlyUsed } from './ColorMostRecentlyUsed'
import type { ExtensionList } from './ExtensionList'
import type { PrintingProperties } from './PrintingProperties'
import type { ShowProperties } from './ShowProperties'
import { defineChild, defineElement, defineProperty, OOXML } from '../../core'

export interface PresentationPropertiesJSON {
  colorMostRecentlyUsed?: string[]
}

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.presentationproperties
 */
@defineElement('p:presentationPr')
export class PresentationProperties extends OOXML {
  attrs = {
    'xmlns': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'xmlns:a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'xmlns:p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'xmlns:r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
    'xmlns:sh': 'http://schemas.openxmlformats.org/officeDocument/2006/sharedTypes',
    'xmlns:xml': 'http://www.w3.org/XML/1998/namespace',
  }

  @defineChild('p:clrMru') declare clrMru?: ColorMostRecentlyUsed
  @defineChild('p:extLst') declare extLst?: ExtensionList
  @defineChild('p:prnPr') declare prnPr?: PrintingProperties
  @defineChild('p:showPr') declare showPr?: ShowProperties

  @defineProperty('clrMru') declare colorMostRecentlyUsed?: string[]

  override toJSON(): PresentationPropertiesJSON {
    return super.toJSON()
  }
}
