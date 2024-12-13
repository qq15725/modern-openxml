import type { RGB } from './_Color'
import { defineAttribute, defineElement } from '../../core'
import { _Color } from './_Color'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.hslcolor
 */
@defineElement('a:hslClr')
export class HslColor extends _Color {
  @defineAttribute('hue', 'ST_PositiveFixedAngle') declare h: number
  @defineAttribute('sat', 'ST_Percentage') declare s: number
  @defineAttribute('lum', 'ST_Percentage') declare l: number

  override toRGB(): RGB {
    const { h, s, l } = this
    return this.hslToRgb(h, s, l)
  }
}
