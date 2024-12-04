import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.offset
 */
@defineElement('a:off')
export class Offset extends OXML {
  @defineAttribute('x', 'emu') declare x: number
  @defineAttribute('y', 'emu') declare y: number
}
