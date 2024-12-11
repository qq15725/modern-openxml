import { defineAttribute, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.shapeguide
 */
@defineElement('a:gd')
export class ShapeGuide extends OOXML {
  @defineAttribute('name') declare name: string
  @defineAttribute('fmla') declare fmla: string
}
