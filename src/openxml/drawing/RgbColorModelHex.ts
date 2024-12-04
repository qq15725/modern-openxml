import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.rgbcolormodelhex
 */
@defineElement('a:srgbClr')
export class RgbColorModelHex extends OXML {
  @defineAttribute('val') declare val: string
}
