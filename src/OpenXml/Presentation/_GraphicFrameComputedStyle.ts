import type { GraphicFrame } from './GraphicFrame'
import { defineProperty, OOXML } from '../../core'

export class _GraphicFrameComputedStyle extends OOXML {
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
