import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.childextents
 */
@defineElement('chExt', 'a')
export class ChildExtents extends OXML {
  @defineAttribute('cx', 'emu') declare cx: number
  @defineAttribute('cy', 'emu') declare cy: number
}
