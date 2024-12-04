import type { OXML } from '../../core'
import type { ColorMapOverride } from './ColorMapOverride'
import { defineAttribute, defineChild, defineElement } from '../../core'
import { _Slide } from './_Slide'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slidelayout
 */
@defineElement('p:sldLayout')
export class SlideLayout extends _Slide {
  attrs = {
    'xmlns:a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'xmlns:r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
    'xmlns:p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
  }

  @defineAttribute('matchingName') matchingName?: string
  @defineAttribute('preserve', 'boolean') preserve?: boolean
  @defineAttribute('showMasterPhAnim', 'boolean') showMasterPhAnim?: boolean
  @defineAttribute('showMasterSp', 'boolean') showMasterSp?: boolean
  @defineAttribute('type', 'ST_SlideLayoutType') type?: string
  @defineAttribute('userDrawn', 'boolean') userDrawn?: boolean

  @defineChild('p:clrMapOvr') declare clrMapOvr: ColorMapOverride
  @defineChild('p:hf') hf?: OXML
}
