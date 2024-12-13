import type { SlideElement } from './_Slide'
import { defineProperty, OOXML } from '../../core'
import { _FillStyle, type Theme } from '../Drawing'
import { Shape } from './Shape'

export class _ShapeComputedStyle extends OOXML {
  @defineProperty('_parent.nvSpPr.cNvPr.visibility') declare visibility?: 'hidden'
  declare left?: number
  declare top?: number
  declare width?: number
  declare height?: number
  declare rotate?: number
  declare backgroundColor?: string
  declare backgroundImage?: string
  declare borderColor?: string
  declare borderImage?: string
  declare scaleX?: number
  declare scaleY?: number
  declare borderWidth?: number
  declare paddingLeft?: number
  declare paddingTop?: number
  declare paddingRight?: number
  declare paddingBottom?: number
  declare textRotate?: number
  declare writingMode?: 'horizontal-tb' | 'vertical-lr' | 'vertical-rl'
  declare textWrap?: 'wrap' | 'nowrap'
  declare textAlign?: 'center' | 'start'
  declare verticalAlign?: 'top' | 'middle' | 'bottom'
  declare shadow?: string

  constructor(
    protected _parent: Shape,
  ) {
    super()
  }

  update(
    theme?: Theme,
    layoutElements?: SlideElement[],
    masterElements?: SlideElement[],
  ): void {
    const { nvSpPr, spPr, style, txBody } = this._parent

    // ph
    let ph: Shape | undefined
    const _ph = nvSpPr?.nvPr.ph
    if (_ph) {
      ph = (
        layoutElements?.find(el => el instanceof Shape && _ph.isEqual(el))
        ?? masterElements?.find(el => el instanceof Shape && _ph.isEqual(el))
      ) as Shape | undefined
    }

    // style
    const _style = theme ? style?.parse(theme) : undefined

    const {
      lIns = ph?.txBody?.bodyPr.lIns,
      tIns = ph?.txBody?.bodyPr.tIns,
      rIns = ph?.txBody?.bodyPr.rIns,
      bIns = ph?.txBody?.bodyPr.bIns,
      rot = ph?.txBody?.bodyPr.rot,
      writingMode = ph?.txBody?.bodyPr.writingMode,
      textWrap = ph?.txBody?.bodyPr.textWrap,
      textAlign = ph?.txBody?.bodyPr.textAlign,
      verticalAlign = ph?.txBody?.bodyPr.verticalAlign,
    } = txBody?.bodyPr ?? {}

    const {
      fill = _style?.fill ?? ph?.spPr?.fill,
      ln = _style?.ln ?? ph?.spPr?.ln,
      // effectDag = _style?.effect?.effectDag ?? ph?.spPr?.effectDag, // TODO
      effectLst = _style?.effect?.effectLst ?? ph?.spPr?.effectLst,
      // scene3d = _style?.effect?.scene3d ?? ph?.spPr?.scene3d, // TODO
      // sp3d = _style?.effect?.sp3d ?? ph?.spPr?.sp3d, // TODO
      xfrm = ph?.spPr?.xfrm,
    } = spPr ?? {}

    const background = _FillStyle.parseFill(fill, theme)
    const border = _FillStyle.parseFill(ln?.fill, theme)

    this.left = xfrm?.off.x
    this.top = xfrm?.off.y
    this.width = xfrm?.ext?.cx
    this.height = xfrm?.ext?.cy
    this.rotate = xfrm?.rot
    this.scaleX = xfrm?.scaleX
    this.scaleY = xfrm?.scaleY
    this.backgroundColor = background.color
    this.backgroundImage = background.image
    this.borderWidth = ln?.w
    this.borderColor = border.color
    this.borderImage = border.image
    this.shadow = effectLst?.shadow
    this.paddingLeft = lIns
    this.paddingTop = tIns
    this.paddingRight = rIns
    this.paddingBottom = bIns
    this.textRotate = rot
    this.writingMode = writingMode
    this.textWrap = textWrap
    this.textAlign = textAlign
    this.verticalAlign = verticalAlign
  }
}
