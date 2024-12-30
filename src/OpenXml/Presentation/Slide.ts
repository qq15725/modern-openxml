import type { IDOCElement } from 'modern-idoc'
import type { IDOCSlideChildElement, SlideContext } from './_Slide'
import type { ColorMapOverride } from './ColorMapOverride'
import { clearEmptyAttrs, defineChild, defineElement } from '../../core'
import { _Slide } from './_Slide'

export interface IDOCSlideElementMeta {
  type: 'slide'
  path?: string
  layoutPath?: string
  layoutIndex: number
}

export interface IDOCSlideElement extends IDOCElement {
  children: IDOCSlideChildElement[]
  meta: IDOCSlideElementMeta
}

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slide
 */
@defineElement('p:sld')
export class Slide extends _Slide {
  path?: string
  layoutPath?: string
  layoutIndex = -1

  attrs = {
    'xmlns': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'xmlns:a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'xmlns:p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'xmlns:r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
  }

  @defineChild('p:clrMapOvr') declare clrMapOvr: ColorMapOverride

  override toIDOC(ctx?: SlideContext): IDOCSlideElement {
    return clearEmptyAttrs({
      fill: this.cSld.bg?.bgPr?.fill?.toIDOC(ctx),
      children: this.elements.map(el => el.toIDOC(ctx)),
      meta: {
        type: 'slide',
        path: this.path,
        layoutPath: this.layoutPath,
        layoutIndex: this.layoutIndex,
      },
    })
  }
}
