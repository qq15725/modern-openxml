import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.point
 */
@defineElement('a:pt')
export class Point extends OXML {
  @defineAttribute('x', 'ST_AdjCoordinate') declare x: number
  @defineAttribute('y', 'ST_AdjCoordinate') declare y: number
}
