import type { BlipFill } from './BlipFill'
import type { NonVisualPictureProperties } from './NonVisualPictureProperties'
import type { ShapeProperties } from './ShapeProperties'
import type { ShapeStyle } from './ShapeStyle'
import { defineChild, defineElement, defineProperty } from '../../core'
import { _Element } from './_Element'
import { _ShapeComputedStyle } from './_ShapeComputedStyle'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.picture
 */
@defineElement('p:pic')
export class Picture extends _Element {
  @defineChild('p:blipFill') declare blipFill: BlipFill
  @defineChild('p:nvPicPr') declare nvPicPr: NonVisualPictureProperties
  @defineChild('p:spPr') declare spPr: ShapeProperties
  @defineChild('p:style') declare style: ShapeStyle

  @defineProperty() type = 'picture'
  @defineProperty('nvPicPr.cNvPr.name') declare name: string
  @defineProperty() computedStyle = new _ShapeComputedStyle(this as any)
  @defineProperty('blipFill.blip.rEmbed') declare src: string
}
