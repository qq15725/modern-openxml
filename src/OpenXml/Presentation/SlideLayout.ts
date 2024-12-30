import type { IDOCElement } from 'modern-idoc'
import type { OOXML } from '../../core'
import type { IDOCSlideChildElement, SlideContext } from './_Slide'
import type { ColorMapOverride } from './ColorMapOverride'
import { clearEmptyAttrs, defineAttribute, defineChild, defineElement } from '../../core'
import { _Slide } from './_Slide'

export interface IDOCSlideLayoutElementMeta {
  type: 'slideLayout'
  path?: string
  masterPath?: string
  masterIndex: number
}

export interface IDOCSlideLayoutElement extends IDOCElement {
  children: IDOCSlideChildElement[]
  meta?: IDOCSlideLayoutElementMeta
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

  override toIDOC(ctx?: SlideContext): IDOCSlideLayoutElement {
    return clearEmptyAttrs({
      children: this.elements.map(el => el.toIDOC(ctx)),
      meta: {
        type: 'slideLayout',
        path: this.path,
        masterPath: this.masterPath,
        masterIndex: this.masterIndex,
      },
    })
  }
}
