import type { RGB } from './_Color'
import { defineAttribute, defineElement } from '../../core'
import { _Color } from './_Color'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.rgbcolormodelpercentage
 */
@defineElement('a:scrgbClr')
export class RgbColorModelPercentage extends _Color {
  @defineAttribute('r', 'ST_Percentage') declare r: number
  @defineAttribute('g', 'ST_Percentage') declare g: number
  @defineAttribute('b', 'ST_Percentage') declare b: number

  override toRGB(): RGB {
    const { r, g, b } = this
    return { r, g, b }
  }
}
