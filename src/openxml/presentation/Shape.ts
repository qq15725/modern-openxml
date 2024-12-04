import type { Paragraph, TextWrappingValues } from '../drawing'
import type { NonVisualShapeProperties } from './NonVisualShapeProperties'
import type { PlaceholderShape } from './PlaceholderShape'
import type { ShapeProperties } from './ShapeProperties'
import type { ShapeStyle } from './ShapeStyle'
import type { TextBody } from './TextBody'
import { defineChild, defineElement, defineProperty, OXML } from '../../core'
import { TextAnchoringTypeValues } from '../drawing'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.shape
 */
@defineElement('p:sp')
export class Shape extends OXML {
  @defineChild('p:nvSpPr') declare nvSpPr: NonVisualShapeProperties
  @defineChild('p:spPr') declare spPr: ShapeProperties
  @defineChild('p:txBody') declare txBody: TextBody
  @defineChild('p:style') declare style: ShapeStyle

  @defineProperty('nvSpPr.cNvPr.id') declare id: string
  @defineProperty('nvSpPr.cNvPr.name') declare name: string
  @defineProperty('nvSpPr.nvPr.ph') declare placeholder: PlaceholderShape
  @defineProperty('nvSpPr.cNvSpPr.txBox') declare isTextBox: boolean
  @defineProperty('spPr.xfrm.off.x') declare left: number
  @defineProperty('spPr.xfrm.off.y') declare top: number
  @defineProperty('spPr.xfrm.ext.cx') declare width: number
  @defineProperty('spPr.xfrm.ext.cy') declare height: number
  @defineProperty('txBody.bodyPr.lIns', 0) declare paddingLeft: number
  @defineProperty('txBody.bodyPr.tIns', 0) declare paddingTop: number
  @defineProperty('txBody.bodyPr.rIns', 0) declare paddingRight: number
  @defineProperty('txBody.bodyPr.bIns', 0) declare paddingBottom: number
  @defineProperty('txBody.bodyPr.rot', 0) declare textRotate: number
  @defineProperty('txBody.bodyPr.wrap', 0) declare textWrap: TextWrappingValues
  @defineProperty('txBody.pList') declare paragraphs: Paragraph[]

  get schemeColor(): string | undefined { return this.spPr.solidFill?.schemeClr?.val }
  get color(): string | undefined { return this.spPr.solidFill?.srgbClr?.val }
  get alpha(): string | undefined { return this.spPr.solidFill?.srgbClr?.alpha?.val }
  get verticalAlign(): TextAnchoringTypeValues { return this.txBody.bodyPr.anchor ?? TextAnchoringTypeValues.ctr }
  get textAlign(): string | undefined { return this.txBody.bodyPr.anchorCtr ? 'center' : undefined }
  get useParagraphSpacing(): boolean { return !!this.txBody.bodyPr.spcFirstLastPara }
  get writingMode(): 'vertical-lr' | 'horizontal-tb' { return this.txBody.bodyPr.upright ? 'vertical-lr' : 'horizontal-tb' }
}
