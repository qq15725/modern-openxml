import type { Alpha } from './Alpha'
import { defineAttribute, defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.hslcolor
 */
@defineElement('a:hslClr')
export class HslColor extends OXML {
  @defineAttribute('hue', 'ST_PositiveFixedAngle') declare hue: number
  @defineAttribute('sat', 'ST_Percentage') declare sat: number
  @defineAttribute('lum', 'ST_Percentage') declare lum: number

  @defineChild('a:alpha') declare alpha?: Alpha

  get color(): string {
    // TODO
    return ''
  }
}
