import type { Transform2D } from '../Drawing'
import type { ExtensionList } from './ExtensionList'
import type { NonVisualGraphicFrameProperties } from './NonVisualGraphicFrameProperties'
import { defineChild, defineElement, defineProperty, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.graphicframe
 */
@defineElement('p:graphicFrame')
export class GraphicFrame extends OOXML {
  @defineChild('p:extLst') declare extLst?: ExtensionList
  @defineChild('a:graphic') declare graphic?: OOXML
  @defineChild('p:nvGraphicFramePr') declare nvGraphicFramePr: NonVisualGraphicFrameProperties
  @defineChild('p:xfrm') declare xfrm: Transform2D

  @defineProperty() type = 'graphicFrame'
  @defineProperty('nvGraphicFramePr.cNvPr.name') declare name?: string
  @defineProperty() style = new _GraphicFrameStyle(this)
}

export class _GraphicFrameStyle extends OOXML {
  @defineProperty('_visibility') declare visibility?: 'hidden'
  @defineProperty('_parent.xfrm.off.x') declare left?: number
  @defineProperty('_parent.xfrm.off.y') declare top?: number
  @defineProperty('_parent.xfrm.ext.cx') declare width?: number
  @defineProperty('_parent.xfrm.ext.cy') declare height?: number
  @defineProperty('_parent.xfrm.rot') declare rotate?: number
  @defineProperty('_scaleX') declare scaleX?: number
  @defineProperty('_scaleY') declare scaleY?: number

  protected get _visibility(): 'hidden' | undefined {
    return this._parent.nvGraphicFramePr.cNvPr?.hidden ? 'hidden' : undefined
  }

  protected get _scaleX(): number | undefined {
    return this._parent.xfrm?.flipH ? -1 : 1
  }

  protected get _scaleY(): number | undefined {
    return this._parent.xfrm?.flipV ? -1 : 1
  }

  constructor(
    protected _parent: GraphicFrame,
  ) {
    super()
  }
}
