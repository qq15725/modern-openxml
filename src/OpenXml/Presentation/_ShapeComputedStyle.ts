import type { Shape } from './Shape'
import { defineProperty, OOXML } from '../../core'

export class _ShapeComputedStyle extends OOXML {
  @defineProperty('_visibility') declare visibility?: 'hidden'
  @defineProperty('_backgroundColor') declare backgroundColor?: string
  @defineProperty('_backgroundImage') declare backgroundImage?: string
  @defineProperty('_parent.spPr.xfrm.off.x') declare left?: number
  @defineProperty('_parent.spPr.xfrm.off.y') declare top?: number
  @defineProperty('_parent.spPr.xfrm.ext.cx') declare width?: number
  @defineProperty('_parent.spPr.xfrm.ext.cy') declare height?: number
  @defineProperty('_parent.spPr.xfrm.rot') declare rotate?: number
  @defineProperty('_scaleX') declare scaleX?: number
  @defineProperty('_scaleY') declare scaleY?: number
  @defineProperty('_parent.spPr.ln.w') declare borderWidth?: number
  @defineProperty('_parent.txBody.bodyPr.lIns') declare paddingLeft?: number
  @defineProperty('_parent.txBody.bodyPr.tIns') declare paddingTop?: number
  @defineProperty('_parent.txBody.bodyPr.rIns') declare paddingRight?: number
  @defineProperty('_parent.txBody.bodyPr.bIns') declare paddingBottom?: number
  @defineProperty('_parent.txBody.bodyPr.rot') declare textRotate?: number
  @defineProperty('_writingMode') declare writingMode?: 'horizontal-tb' | 'vertical-lr' | 'vertical-rl'
  @defineProperty('_textWrap') declare textWrap?: 'wrap' | 'nowrap'
  @defineProperty('_textAlign') declare textAlign?: 'center' | 'start'
  @defineProperty('_verticalAlign') declare verticalAlign?: 'top' | 'middle' | 'bottom'
  @defineProperty('_shadow') declare shadow?: string

  protected get _visibility(): 'hidden' | undefined {
    return this._parent.nvSpPr?.cNvPr.hidden ? 'hidden' : undefined
  }

  protected get _scaleX(): number | undefined {
    return this._parent.spPr.xfrm?.flipH ? -1 : 1
  }

  protected get _scaleY(): number | undefined {
    return this._parent.spPr.xfrm?.flipV ? -1 : 1
  }

  protected get _backgroundColor(): string | undefined {
    return this._parent.spPr.getFill().color
  }

  protected get _backgroundImage(): string | undefined {
    return this._parent.spPr.getFill().image
  }

  protected get _writingMode(): 'horizontal-tb' | 'vertical-lr' | 'vertical-rl' | undefined {
    switch (this._parent.txBody?.bodyPr.vert) {
      case 'eaVert':
      case 'mongolianVert':
      case 'vert':
      case 'vert270':
      case 'wordArtVertRtl':
      case 'wordArtVert':
        return 'vertical-rl'
      case 'horz':
        return 'horizontal-tb'
    }

    switch (this._parent.txBody?.bodyPr.upright) {
      case true:
        return 'vertical-rl'
      case false:
        return 'horizontal-tb'
    }

    return undefined
  }

  protected get _textWrap(): 'wrap' | 'nowrap' | undefined {
    switch (this._parent.txBody?.bodyPr.wrap) {
      case 'none':
        return 'nowrap'
      case 'square':
        return 'wrap'
      default:
        return undefined
    }
  }

  protected get _verticalAlign(): 'top' | 'middle' | 'bottom' | undefined {
    switch (this._parent.txBody?.bodyPr.anchor) {
      case 't':
        return 'top'
      case 'b':
        return 'bottom'
      case 'ctr':
        return 'middle'
      default:
        return undefined
    }
  }

  protected get _textAlign(): 'center' | 'start' | undefined {
    switch (this._parent.txBody?.bodyPr.anchorCtr) {
      case true:
        return 'center'
      case false:
        return 'start'
      default:
        return undefined
    }
  }

  protected get _shadow(): string | undefined {
    const effectLst = this._parent.spPr.effectLst
    if (!effectLst) {
      return undefined
    }
    const shdw = effectLst.outerShdw
    if (!shdw) {
      return undefined
    }
    const distance = shdw.dist ?? 0
    const color = shdw.toJSON() ?? 'rgba(0, 0, 0, 1)'
    const blurRadius = shdw.blurRad ?? 0
    const degree = (shdw.dir ?? 0) + 90
    const radian = (degree / 180) * Math.PI
    const dx = distance * Math.sin(radian)
    const dy = distance * -Math.cos(radian)
    const sx = shdw.sx ?? 1
    const sy = shdw.sy ?? 1
    return `${dx * sx}px ${dy * sy}px ${blurRadius}px ${color}`
  }

  constructor(
    protected _parent: Shape,
  ) {
    super()
  }
}
