import type { OOXML } from '../../core'
import type { Transform2D } from '../Drawing'
import type { ExtensionList } from './ExtensionList'
import type { NonVisualGraphicFrameProperties } from './NonVisualGraphicFrameProperties'
import { defineChild, defineElement, filterObjectEmptyAttr } from '../../core'
import { _SlideElement, type SlideElementContext } from './_SlideElement'

export interface GraphicFrameJSON {
  type: 'graphicFrame'
  name?: string
  style: {
    visibility?: 'hidden'
    left?: number
    top?: number
    width?: number
    height?: number
    rotate?: number
    scaleX?: number
    scaleY?: number
  }
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

  override toJSON(ctx: SlideElementContext = {}): GraphicFrameJSON {
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

    return filterObjectEmptyAttr({
      type: 'graphicFrame',
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
    })
  }
}
