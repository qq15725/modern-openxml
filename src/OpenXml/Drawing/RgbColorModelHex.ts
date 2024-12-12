import type { RGB } from './_Color'
import { defineAttribute, defineElement } from '../../core'
import { _Color } from './_Color'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.rgbcolormodelhex
 */
@defineElement('a:srgbClr')
export class RgbColorModelHex extends _Color {
  @defineAttribute('val') declare val: string

  override toRGB(): RGB {
    return this.hexToRgb(this.val)
  }
}
