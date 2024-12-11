import { defineAttribute, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.spacingpoints
 */
@defineElement('a:spcPts')
export class SpacingPoints extends OOXML {
  @defineAttribute('val', 'ST_TextSpacingPoint') declare val: number
}
