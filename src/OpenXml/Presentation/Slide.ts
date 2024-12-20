import type { BlipFillJSON } from '../Drawing'
import type { SlideContext, SlideElementJSON } from './_Slide'
import type { ColorMapOverride } from './ColorMapOverride'
import { defineChild, defineElement, filterObjectEmptyAttr } from '../../core'
import { _Slide } from './_Slide'

export interface SlideJSON {
  type: 'slide'
  name?: string
  layoutIndex: number
  background?: BlipFillJSON
  style: {
    backgroundColor?: string
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
    let background
    let backgroundColor
    const fill = this.cSld.bg?.bgPr?.fill?.toJSON(ctx)
    switch (fill?.type) {
      case 'solidFill':
        backgroundColor = fill.color
        break
      case 'blipFill':
        background = fill
        break
    }
    return filterObjectEmptyAttr({
      type: 'slide',
      layoutIndex: this.layoutIndex,
      background,
      style: {
        backgroundColor,
      },
      elements: this.elements.map(el => el.toJSON(ctx)),
    })
  }
}
