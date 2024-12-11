import { defineAttribute, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.spacingpercent
 */
@defineElement('a:spcPct')
export class SpacingPercent extends OOXML {
  @defineAttribute('val', 'ST_TextSpacingPercentOrPercentString') declare val: number
}
