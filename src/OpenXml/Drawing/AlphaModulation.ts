import { defineAttribute, defineElement, OOXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.alphamodulation
 */
@defineElement('a:alphaMod')
export class AlphaModulation extends OOXML {
  @defineAttribute('val', 'ST_PositivePercentage') declare val: number
}
