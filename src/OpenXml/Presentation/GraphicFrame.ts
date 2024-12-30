import type { IDOCElement } from 'modern-idoc'
import type { OOXML } from '../../core'
import type { Transform2D } from '../Drawing'
import type { SlideContext } from './_Slide'
import type { ExtensionList } from './ExtensionList'
import type { NonVisualGraphicFrameProperties } from './NonVisualGraphicFrameProperties'
import type { IDOCPlaceholderShape } from './PlaceholderShape'
import { clearEmptyAttrs, defineChild, defineElement } from '../../core'
import { _SlideElement } from './_SlideElement'

export interface IDOCGraphicFrameElementMeta {
  type: 'graphicFrame'
  placeholderShape?: IDOCPlaceholderShape
}

export interface IDOCGraphicFrameElement extends IDOCElement {
  meta: IDOCGraphicFrameElementMeta
}

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.graphicframe
 */
@defineElement('p:graphicFrame')
export class GraphicFrame extends _SlideElement {
  @defineChild('p:extLst') declare extLst?: ExtensionList
  @defineChild('a:graphic') declare graphic?: OOXML
  @defineChild('p:nvGraphicFramePr') declare nvGraphicFramePr?: NonVisualGraphicFrameProperties
  @defineChild('p:xfrm') declare xfrm?: Transform2D

  override hasPh(): boolean {
    return Boolean(this.nvGraphicFramePr?.nvPr?.ph)
  }

  override toIDOC(ctx: SlideContext = {}): IDOCGraphicFrameElement {
    const { layout, master } = ctx

    // ph
    let _ph: GraphicFrame | undefined
    const ph = this.nvGraphicFramePr?.nvPr?.ph
    if (ph) {
      _ph = (layout?.findPh(ph) ?? master?.findPh(ph)) as GraphicFrame | undefined
    }

    const inherited = (path: string): any => {
      return this.offsetGet(path)
        ?? _ph?.offsetGet(path)
    }

    return clearEmptyAttrs({
      name: inherited('nvGraphicFramePr.cNvPr.name'),
      style: {
        visibility: inherited('nvGraphicFramePr.cNvPr.visibility'),
        left: inherited('xfrm.off.x'),
        top: inherited('xfrm.off.y'),
        width: inherited('xfrm.ext.cx'),
        height: inherited('xfrm.ext.cy'),
        rotate: inherited('xfrm.rot'),
        scaleX: inherited('xfrm.scaleX'),
        scaleY: inherited('xfrm.scaleY'),
      },
      meta: {
        type: 'graphicFrame',
        placeholderShape: ph?.toIDOC(),
      },
    })
  }
}
