import type { Paragraph, TextAnchoringTypeValues, TextWrappingValues } from '../drawing'
import type { PlaceholderShape } from './PlaceholderShape'
import { defineChild } from '../../core'
import { _Namespace } from './_Namespace'
import { NonVisualShapeProperties } from './NonVisualShapeProperties'
import { ShapeProperties } from './ShapeProperties'
import { TextBody } from './TextBody'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.shape
 */
export class Shape extends _Namespace {
  readonly tag = 'sp'

  @defineChild('p:nvSpPr', NonVisualShapeProperties) declare nvSpPr: NonVisualShapeProperties
  @defineChild('p:spPr', ShapeProperties) declare spPr: ShapeProperties
  @defineChild('p:txBody', TextBody) declare txBody: TextBody

  get id(): string { return this.nvSpPr.cNvPr.id }
  get name(): string { return this.nvSpPr.cNvPr.name }
  get schemeColor(): string | undefined { return this.spPr.solidFill?.schemeClr?.val }
  get color(): string | undefined { return this.spPr.solidFill?.srgbClr?.val }
  get alpha(): string | undefined { return this.spPr.solidFill?.srgbClr?.alpha?.val }
  get isTextBox(): boolean { return !!this.nvSpPr.cNvSpPr.txBox }
  get left(): number { return this.spPr.xfrm.off.x }
  get top(): number { return this.spPr.xfrm.off.y }
  get width(): number { return this.spPr.xfrm.ext.cx }
  get height(): number { return this.spPr.xfrm.ext.cy }
  get verticalAlign(): TextAnchoringTypeValues { return this.txBody.bodyPr.anchor ?? 'middle' }
  get textAlign(): string | undefined { return this.txBody.bodyPr.anchorCtr ? 'center' : undefined }
  get useParagraphSpacing(): boolean { return !!this.txBody.bodyPr.spcFirstLastPara }
  get paddingLeft(): number { return this.txBody.bodyPr.lIns ?? 0 }
  get paddingTop(): number { return this.txBody.bodyPr.tIns ?? 0 }
  get paddingRight(): number { return this.txBody.bodyPr.rIns ?? 0 }
  get paddingBottom(): number { return this.txBody.bodyPr.bIns ?? 0 }
  get textRotation(): number { return this.txBody.bodyPr.rot ?? 0 }
  get textWrapping(): TextWrappingValues { return this.txBody.bodyPr.wrap ?? 'none' }
  get writingMode(): 'vertical-lr' | 'horizontal-tb' { return this.txBody.bodyPr.upright ? 'vertical-lr' : 'horizontal-tb' }
  get paragraphs(): Paragraph[] { return this.txBody.pList }
  get placeholderShape(): PlaceholderShape | undefined { return this.nvSpPr.nvPr.ph }
}
