import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.fillrectangle
 */
@defineElement('a:fillRect')
export class FillRectangle extends OXML {
  @defineAttribute('b', 'rate') declare b: number
  @defineAttribute('l', 'rate') declare l: number
  @defineAttribute('r', 'rate') declare r: number
  @defineAttribute('t', 'rate') declare t: number
}
