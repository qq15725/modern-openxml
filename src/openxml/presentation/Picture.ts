import type { BlipFill } from './BlipFill'
import type { NonVisualPictureProperties } from './NonVisualPictureProperties'
import type { ShapeProperties } from './ShapeProperties'
import type { ShapeStyle } from './ShapeStyle'
import { defineChild, defineElement, defineProperty, OXML } from '../../core'
import { _ShapeStyle } from './Shape'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.picture
 */
@defineElement('p:pic')
export class Picture extends OXML {
  @defineChild('p:blipFill') declare blipFill: BlipFill
  @defineChild('p:nvPicPr') declare nvPicPr: NonVisualPictureProperties
  @defineChild('p:spPr') declare spPr: ShapeProperties
  @defineChild('p:style') declare pStyle: ShapeStyle

  @defineProperty() type = 'picture'
  @defineProperty('nvPicPr.cNvPr.id') declare id: string
  @defineProperty('nvPicPr.cNvPr.name') declare name: string
  @defineProperty() style = new _ShapeStyle(this as any)
  @defineProperty('blipFill.blip.rEmbed') declare src: string
}
