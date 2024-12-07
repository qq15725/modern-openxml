import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.extents
 */
@defineElement('a:ext')
export class Extents extends OXML {
  @defineAttribute('cx', 'emu') declare cx: number
  @defineAttribute('cy', 'emu') declare cy: number
}
