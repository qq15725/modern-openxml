import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.shapeguide
 */
@defineElement('a:gd')
export class ShapeGuide extends OXML {
  @defineAttribute('name') declare name: string
  @defineAttribute('fmla') declare fmla: string
}
