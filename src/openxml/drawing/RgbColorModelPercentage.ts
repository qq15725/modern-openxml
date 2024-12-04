import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.rgbcolormodelpercentage
 */
@defineElement('a:scrgbClr')
export class RgbColorModelPercentage extends OXML {
  @defineAttribute('r', 'percentage') declare r: number
  @defineAttribute('g', 'percentage') declare g: number
  @defineAttribute('b', 'percentage') declare b: number
}
