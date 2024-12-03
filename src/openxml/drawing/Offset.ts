import { defineElement, defineProperty, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.offset
 */
@defineElement('off', 'a')
export class Offset extends OXML {
  @defineProperty('x', 'emu') declare x: number
  @defineProperty('y', 'emu') declare y: number
}
