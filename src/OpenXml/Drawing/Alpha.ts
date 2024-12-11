import { defineAttribute, defineElement, OOXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.alpha
 */
@defineElement('a:alpha')
export class Alpha extends OOXML {
  @defineAttribute('val', 'CT_PositiveFixedPercentage') declare val: number
}
