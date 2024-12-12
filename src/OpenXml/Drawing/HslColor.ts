import type { RGB } from './_Color'
import { defineAttribute, defineElement } from '../../core'
import { _Color } from './_Color'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.hslcolor
 */
@defineElement('a:hslClr')
export class HslColor extends _Color {
  @defineAttribute('hue', 'ST_PositiveFixedAngle') declare hue: number
  @defineAttribute('sat', 'ST_Percentage') declare sat: number
  @defineAttribute('lum', 'ST_Percentage') declare lum: number

  override toRGB(): RGB {
    const { hue: h, sat: s, lum: l } = this
    return this.hslToRgb(h, s, l)
  }
}
