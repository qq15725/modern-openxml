import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.hslcolor
 */
@defineElement('a:hslClr')
export class HslColor extends OXML {
  @defineAttribute('hue', 'positiveFixedAngle') declare hue: number
  @defineAttribute('sat', 'percentage') declare sat: number
  @defineAttribute('lum', 'percentage') declare lum: number
}
