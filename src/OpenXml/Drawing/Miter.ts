import { defineAttribute, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.miter
 */
@defineElement('a:miter')
export class Miter extends OOXML {
  @defineAttribute('lim', 'ST_PositivePercentage') declare lim: number
}
