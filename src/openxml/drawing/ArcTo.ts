import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.arcto
 */
@defineElement('a:arcTo')
export class ArcTo extends OXML {
  @defineAttribute('hR', 'ST_AdjCoordinate') declare hR: number
  @defineAttribute('wR', 'ST_AdjCoordinate') declare wR: number
  @defineAttribute('stAng', 'ST_AdjAngle') declare stAng: number
  @defineAttribute('swAng', 'ST_AdjAngle') declare swAng: number
}
