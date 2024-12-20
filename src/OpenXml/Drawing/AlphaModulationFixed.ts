import { defineAttribute, defineElement, OOXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.alphamodulationfixed
 */
@defineElement('a:alphaModFix')
export class AlphaModulationFixed extends OOXML {
  @defineAttribute('amt', 'ST_PositivePercentage') declare amt: number
}
