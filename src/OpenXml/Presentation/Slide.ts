import type { SlideContext, SlideElementJSON } from './_Slide'
import type { ColorMapOverride } from './ColorMapOverride'
import { defineChild, defineElement, filterObjectEmptyAttr } from '../../core'
import { _Slide } from './_Slide'

export interface SlideJSON {
  type: 'slide'
  layoutIndex: number
  style: {
    backgroundColor?: string
    backgroundImage?: string
  }
  elements: SlideElementJSON[]
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

  override toJSON(ctx?: SlideContext): SlideJSON {
    const background = this.cSld.bg?.bgPr?.fill?.toJSON(ctx)
    return filterObjectEmptyAttr({
      type: 'slide',
      layoutIndex: this.layoutIndex,
      style: {
        backgroundColor: background?.color,
        backgroundImage: background?.image,
      },
      elements: this.elements.map(el => el.toJSON(ctx)),
    })
  }
}
