import { defineAttribute, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.rectangle
 */
@defineElement('a:rect')
export class Rectangle extends OOXML {
  @defineAttribute('b', 'ST_AdjCoordinate') declare b: number
  @defineAttribute('l', 'ST_AdjCoordinate') declare l: number
  @defineAttribute('t', 'ST_AdjCoordinate') declare t: number
  @defineAttribute('r', 'ST_AdjCoordinate') declare r: number
}
