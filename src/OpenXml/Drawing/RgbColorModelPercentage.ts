import type { Alpha } from './Alpha'
import { defineAttribute, defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.rgbcolormodelpercentage
 */
@defineElement('a:scrgbClr')
export class RgbColorModelPercentage extends OOXML {
  @defineAttribute('r', 'ST_Percentage') declare r: number
  @defineAttribute('g', 'ST_Percentage') declare g: number
  @defineAttribute('b', 'ST_Percentage') declare b: number

  @defineChild('a:alpha') declare alpha?: Alpha

  get color(): string {
    const { r, g, b, alpha } = this
    return `rgba(${~~(r * 255)}, ${~~(g * 255)}, ${~~(b * 255)}, ${alpha?.val ?? 1})`
  }
}
