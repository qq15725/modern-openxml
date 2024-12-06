import type { Alpha } from './Alpha'
import { defineAttribute, defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.rgbcolormodelpercentage
 */
@defineElement('a:scrgbClr')
export class RgbColorModelPercentage extends OXML {
  @defineAttribute('r', 'ST_Percentage') declare r: number
  @defineAttribute('g', 'ST_Percentage') declare g: number
  @defineAttribute('b', 'ST_Percentage') declare b: number

  @defineChild('a:alpha') declare alpha?: Alpha
}
