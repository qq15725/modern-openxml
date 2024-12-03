import { defineElement, defineProperty, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.extents
 */
@defineElement('off', 'a')
export class Extents extends OXML {
  @defineProperty('cx', 'emu') declare cx: number
  @defineProperty('cy', 'emu') declare cy: number
}
