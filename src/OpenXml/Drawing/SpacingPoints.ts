import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.spacingpoints
 */
@defineElement('a:spcPts')
export class SpacingPoints extends OXML {
  @defineAttribute('val', 'ST_TextSpacingPoint') declare val: number
}
