import type { BlipFill } from './BlipFill'
import type { NonVisualPictureProperties } from './NonVisualPictureProperties'
import type { ShapeProperties } from './ShapeProperties'
import type { ShapeStyle } from './ShapeStyle'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.picture
 */
@defineElement('pic', 'p')
export class Picture extends OXML {
  @defineChild('blipFill') declare blipFill: BlipFill
  @defineChild('nvPicPr') declare nvPicPr: NonVisualPictureProperties
  @defineChild('spPr') declare spPr: ShapeProperties
  @defineChild('style') declare style: ShapeStyle

  get id(): string { return this.nvPicPr.cNvPr.id }
  get name(): string { return this.nvPicPr.cNvPr.name }
  get left(): number { return this.spPr.xfrm.off.x }
  get top(): number { return this.spPr.xfrm.off.y }
  get width(): number { return this.spPr.xfrm.ext.cx }
  get height(): number { return this.spPr.xfrm.ext.cy }
  get rEmbed(): string { return this.blipFill.blip.rEmbed }
}
