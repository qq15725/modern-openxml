import type { BlipFill } from './BlipFill'
import type { NonVisualPictureProperties } from './NonVisualPictureProperties'
import type { ShapeProperties } from './ShapeProperties'
import type { ShapeStyle } from './ShapeStyle'
import { defineChild, defineElement, defineProperty, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.picture
 */
@defineElement('p:pic')
export class Picture extends OXML {
  @defineChild('p:blipFill') declare blipFill: BlipFill
  @defineChild('p:nvPicPr') declare nvPicPr: NonVisualPictureProperties
  @defineChild('p:spPr') declare spPr: ShapeProperties
  @defineChild('p:style') declare style: ShapeStyle

  @defineProperty('nvPicPr.cNvPr.id') declare id: string
  @defineProperty('nvPicPr.cNvPr.name') declare name: string
  @defineProperty('spPr.xfrm.off.x') declare left: number
  @defineProperty('spPr.xfrm.off.y') declare top: number
  @defineProperty('spPr.xfrm.ext.cx') declare width: number
  @defineProperty('spPr.xfrm.ext.cy') declare height: number
  @defineProperty('blipFill.blip.rEmbed') declare rEmbed: string
}
