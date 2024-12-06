import type { Paragraph } from '../drawing'
import type { NonVisualShapeProperties } from './NonVisualShapeProperties'
import type { PlaceholderShape } from './PlaceholderShape'
import type { ShapeProperties } from './ShapeProperties'
import type { ShapeStyle } from './ShapeStyle'
import type { TextBody } from './TextBody'
import { defineChild, defineElement, defineProperty, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.shape
 */
@defineElement('p:sp')
export class Shape extends OXML {
  @defineChild('p:nvSpPr') declare nvSpPr: NonVisualShapeProperties
  @defineChild('p:spPr') declare spPr: ShapeProperties
  @defineChild('p:txBody') declare txBody: TextBody
  @defineChild('p:style') declare pStyle?: ShapeStyle

  @defineProperty() type = 'shape'
  @defineProperty('nvSpPr.cNvPr.id') declare id?: string
  @defineProperty('nvSpPr.cNvPr.name') declare name?: string
  @defineProperty() style = new _ShapeStyle(this)
  @defineProperty('nvSpPr.nvPr.ph') declare placeholder?: PlaceholderShape

  @defineProperty('spPr.ln') declare outline: Record<string, any>
  @defineProperty('_paragraphs') declare paragraphs: Paragraph[]

  get schemeColor(): string | undefined { return this.spPr.solidFill?.schemeClr?.val }
  get color(): string | undefined { return this.spPr.solidFill?.srgbClr?.val }
  get alpha(): string | undefined { return this.spPr.solidFill?.srgbClr?.alpha?.val }
  get useParagraphSpacing(): boolean { return !!this.txBody.bodyPr.spcFirstLastPara }
  get geometry() {
    return this.spPr.prstGeom
  }

  get _paragraphs(): Paragraph[] | undefined {
    if (this.nvSpPr.cNvSpPr.txBox) {
      return this.txBody.pList
    }
    return undefined
  }
}

export class _ShapeStyle extends OXML {
  @defineProperty('_parent.spPr.xfrm.off.x') declare left: number
  @defineProperty('_parent.spPr.xfrm.off.y') declare top: number
  @defineProperty('_parent.spPr.xfrm.ext.cx') declare width: number
  @defineProperty('_parent.spPr.xfrm.ext.cy') declare height: number
  @defineProperty('_parent.spPr.xfrm.rot') declare rotate: number
  @defineProperty('_parent.spPr.xfrm.flipH') declare flipH: boolean
  @defineProperty('_parent.spPr.xfrm.flipV') declare flipV: boolean

  @defineProperty('_parent.txBody.bodyPr.lIns') declare paddingLeft: number
  @defineProperty('_parent.txBody.bodyPr.tIns') declare paddingTop: number
  @defineProperty('_parent.txBody.bodyPr.rIns') declare paddingRight: number
  @defineProperty('_parent.txBody.bodyPr.bIns') declare paddingBottom: number
  @defineProperty('_parent.txBody.bodyPr.rot') declare textRotate: number
  @defineProperty('_writingMode') declare writingMode?: 'horizontal-tb' | 'vertical-lr' | 'vertical-rl'
  @defineProperty('_textWrap') declare textWrap?: 'wrap' | 'nowrap'
  @defineProperty('_textAlign') declare textAlign?: 'center' | 'start'
  @defineProperty('_verticalAlign') declare verticalAlign?: 'top' | 'middle' | 'bottom'

  protected get _writingMode(): 'horizontal-tb' | 'vertical-lr' | 'vertical-rl' | undefined {
    switch (this._parent.txBody.bodyPr.upright) {
      case true:
        return 'vertical-rl'
      case false:
        return 'horizontal-tb'
      default:
        return undefined
    }
  }

  protected get _textWrap(): 'wrap' | 'nowrap' | undefined {
    switch (this._parent.txBody.bodyPr.wrap) {
      case 'none':
        return 'nowrap'
      case 'square':
        return 'wrap'
      default:
        return undefined
    }
  }

  protected get _verticalAlign(): 'top' | 'middle' | 'bottom' | undefined {
    switch (this._parent.txBody.bodyPr.anchor) {
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
    switch (this._parent.txBody.bodyPr.anchorCtr) {
      case true:
        return 'center'
      case false:
        return 'start'
      default:
        return undefined
    }
  }

  constructor(
    protected _parent: Shape,
  ) {
    super()
  }
}
