import type { IDOCElement } from 'modern-idoc'
import type { IDOCColorMap } from '../Drawing'
import type { IDOCSlideChildElement, SlideContext } from './_Slide'
import type { ColorMap } from './ColorMap'
import type { HeaderFooter } from './HeaderFooter'
import type { SlideLayoutIdList } from './SlideLayoutIdList'
import type { TextStyles } from './TextStyles'
import { clearEmptyAttrs, defineAttribute, defineChild, defineElement } from '../../core'
import { _Slide } from './_Slide'

export interface IDOCSlideMasterElementMeta {
  type: 'slideMaster'
  path?: string
  themePath?: string
  themeIndex: number
  colorMap?: IDOCColorMap
}

export interface IDOCSlideMasterElement extends IDOCElement {
  children: IDOCSlideChildElement[]
  meta: IDOCSlideMasterElementMeta
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

  override toIDOC(ctx?: SlideContext): IDOCSlideMasterElement {
    return clearEmptyAttrs({
      children: this.elements.map(el => el.toIDOC(ctx)),
      meta: {
        type: 'slideMaster',
        path: this.path,
        themePath: this.themePath,
        themeIndex: this.themeIndex,
        colorMap: this.clrMap?.toIDOC(),
      },
    })
  }
}
