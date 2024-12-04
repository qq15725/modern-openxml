import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.rectangle
 */
@defineElement('a:rect')
export class Rectangle extends OXML {
  @defineAttribute('b', 'adjCoordinate') declare b: number
  @defineAttribute('l', 'adjCoordinate') declare l: number
  @defineAttribute('r', 'adjCoordinate') declare r: number
  @defineAttribute('t', 'adjCoordinate') declare t: number
}
