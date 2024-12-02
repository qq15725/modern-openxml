import { defineChild } from '../../core'
import { _Namespace } from './_Namespace'
import { BlipFill } from './BlipFill'
import { NonVisualPictureProperties } from './NonVisualPictureProperties'
import { ShapeProperties } from './ShapeProperties'
import { ShapeStyle } from './ShapeStyle'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.picture
 */
export class Picture extends _Namespace {
  readonly tag = 'pic'

  @defineChild('p:blipFill', BlipFill) declare blipFill: BlipFill
  @defineChild('p:nvPicPr', NonVisualPictureProperties) declare nvPicPr: NonVisualPictureProperties
  @defineChild('p:spPr', ShapeProperties) declare spPr: ShapeProperties
  @defineChild('p:style', ShapeStyle) declare style: ShapeStyle

  get id(): string { return this.nvPicPr.cNvPr.id }
  get name(): string { return this.nvPicPr.cNvPr.name }
  get left(): number { return this.spPr.xfrm.off.x }
  get top(): number { return this.spPr.xfrm.off.y }
  get width(): number { return this.spPr.xfrm.ext.cx }
  get height(): number { return this.spPr.xfrm.ext.cy }
  get rEmbed(): string { return this.blipFill.blip.rEmbed }
}
