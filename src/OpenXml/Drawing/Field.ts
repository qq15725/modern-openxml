import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.field
 */
@defineElement('a:fld')
export class Field extends OXML {
  @defineAttribute('id') declare id?: string
  @defineAttribute('type') declare type?: string
}
