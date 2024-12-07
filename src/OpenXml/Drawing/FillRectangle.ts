import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.fillrectangle
 */
@defineElement('a:fillRect')
export class FillRectangle extends OXML {
  @defineAttribute('b', 'ST_Percentage') declare b: number
  @defineAttribute('l', 'ST_Percentage') declare l: number
  @defineAttribute('r', 'ST_Percentage') declare r: number
  @defineAttribute('t', 'ST_Percentage') declare t: number
}
