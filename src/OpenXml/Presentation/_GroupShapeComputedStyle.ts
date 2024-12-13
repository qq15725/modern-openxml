import type { GroupShape } from './GroupShape'
import { defineProperty, OOXML } from '../../core'

export class _GroupShapeComputedStyle extends OOXML {
  @defineProperty('_parent.nvGrpSpPr.cNvPr.visibility') declare visibility?: 'hidden'
  @defineProperty('_parent.grpSpPr.xfrm.off.x') declare left: number
  @defineProperty('_parent.grpSpPr.xfrm.off.y') declare top: number
  @defineProperty('_parent.grpSpPr.xfrm.ext.cx') declare width: number
  @defineProperty('_parent.grpSpPr.xfrm.ext.cy') declare height: number
  @defineProperty('_parent.grpSpPr.xfrm.rot') declare rotate: number
  @defineProperty('_parent.grpSpPr.xfrm.scaleX') declare scaleX?: number
  @defineProperty('_parent.grpSpPr.xfrm.scaleY') declare scaleY?: number
  @defineProperty('_parent.grpSpPr.xfrm.chOff.x') declare childOffsetLeft: number
  @defineProperty('_parent.grpSpPr.xfrm.chOff.y') declare childOffsetTop: number
  @defineProperty('_parent.grpSpPr.xfrm.chExt.cx') declare childWidth: number
  @defineProperty('_parent.grpSpPr.xfrm.chExt.cy') declare childHeight: number

  constructor(
    protected _parent: GroupShape,
  ) {
    super()
  }
}
