import type { OOXML } from '../../core'
import type { SlideContext, SlideElementJSON } from './_Slide'
import type { ColorMapOverride } from './ColorMapOverride'
import { defineAttribute, defineChild, defineElement } from '../../core'
import { _Slide } from './_Slide'

export interface SlideLayoutJSON {
  type: 'slideLayout'
  masterIndex: number
  elements: SlideElementJSON[]
}

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slidelayout
 */
@defineElement('p:sldLayout')
export class SlideLayout extends _Slide {
  path?: string
  masterPath?: string
  masterIndex = -1

  attrs = {
    'xmlns:a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'xmlns:r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
    'xmlns:p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
  }

  @defineAttribute('matchingName') declare matchingName?: string
  @defineAttribute('preserve', 'boolean') declare preserve?: boolean
  @defineAttribute('showMasterPhAnim', 'boolean') declare showMasterPhAnim?: boolean
  @defineAttribute('showMasterSp', 'boolean') declare showMasterSp?: boolean
  @defineAttribute('type', 'ST_SlideLayoutType') declare type?: string
  @defineAttribute('userDrawn', 'boolean') declare userDrawn?: boolean

  @defineChild('p:clrMapOvr') declare clrMapOvr: ColorMapOverride
  @defineChild('p:hf') declare hf?: OOXML

  override toJSON(ctx?: SlideContext): SlideLayoutJSON {
    return {
      type: 'slideLayout',
      masterIndex: this.masterIndex,
      elements: this.elements.filter(el => !el.hasPh()).map(el => el.toJSON(ctx)),
    }
  }
}
