import { defineElement, defineProperty, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.fillrectangle
 */
@defineElement('fillRect', 'a')
export class FillRectangle extends OXML {
  @defineProperty('b', 'rate') declare b: number
  @defineProperty('l', 'rate') declare l: number
  @defineProperty('r', 'rate') declare r: number
  @defineProperty('t', 'rate') declare t: number
}
