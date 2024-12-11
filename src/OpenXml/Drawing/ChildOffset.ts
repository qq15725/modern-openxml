import { defineAttribute, defineElement, OOXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.childoffset
 */
@defineElement('a:chOff')
export class ChildOffset extends OOXML {
  @defineAttribute('x', 'emu') declare x: number
  @defineAttribute('y', 'emu') declare y: number
}
