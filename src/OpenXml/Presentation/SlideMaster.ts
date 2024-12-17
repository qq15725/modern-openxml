import type { SlideContext, SlideElementJSON } from './_Slide'
import type { ColorMap } from './ColorMap'
import type { HeaderFooter } from './HeaderFooter'
import type { SlideLayoutIdList } from './SlideLayoutIdList'
import type { TextStyles } from './TextStyles'
import { defineAttribute, defineChild, defineElement, defineProperty } from '../../core'
import { _Slide } from './_Slide'

export interface SlideMasterJSON {
  type: 'slideMaster'
  themeIndex: number
  colorMap?: Record<string, any>
  elements: SlideElementJSON[]
}

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slidemaster
 */
@defineElement('p:sldMaster')
export class SlideMaster extends _Slide {
  path?: string
  themePath?: string
  themeIndex = -1

  attrs = {
    'xmlns:a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'xmlns:r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
    'xmlns:p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
  }

  @defineAttribute('preserve', 'boolean') declare preserve?: boolean

  @defineChild('p:clrMap') declare clrMap?: ColorMap
  @defineChild('p:hf') declare hf?: HeaderFooter
  @defineChild('p:sldLayoutIdLst') declare sldLayoutIdLst?: SlideLayoutIdList
  @defineChild('p:txStyles') declare txStyles?: TextStyles

  @defineProperty('clrMap') declare colorMap?: any

  override toJSON(ctx?: SlideContext): SlideMasterJSON {
    return {
      type: 'slideMaster',
      themeIndex: this.themeIndex,
      colorMap: this.clrMap?.toJSON(ctx),
      elements: this.elements.filter(el => !el.hasPh()).map(el => el.toJSON(ctx)),
    }
  }
}
