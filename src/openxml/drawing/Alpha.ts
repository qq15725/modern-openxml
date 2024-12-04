import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.alpha
 */
@defineElement('a:alpha')
export class Alpha extends OXML {
  @defineAttribute('val') declare val: string
}
