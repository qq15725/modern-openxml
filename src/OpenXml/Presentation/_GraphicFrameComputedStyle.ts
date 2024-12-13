import type { GraphicFrame } from './GraphicFrame'
import { defineProperty, OOXML } from '../../core'

export class _GraphicFrameComputedStyle extends OOXML {
  @defineProperty('_parent.nvGraphicFramePr.cNvPr.visibility') declare visibility?: 'hidden'
  @defineProperty('_parent.xfrm.off.x') declare left?: number
  @defineProperty('_parent.xfrm.off.y') declare top?: number
  @defineProperty('_parent.xfrm.ext.cx') declare width?: number
  @defineProperty('_parent.xfrm.ext.cy') declare height?: number
  @defineProperty('_parent.xfrm.rot') declare rotate?: number
  @defineProperty('_parent.xfrm.scaleX') declare scaleX?: number
  @defineProperty('_parent.xfrm.scaleY') declare scaleY?: number

  constructor(
    protected _parent: GraphicFrame,
  ) {
    super()
  }
}
