import { defineAttribute, defineElement } from '../../core'
import { _ColorStyle } from './_ColorStyle'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.linereference
 */
@defineElement('a:lnRef')
export class LineReference extends _ColorStyle {
  @defineAttribute('idx') declare idx: string
}
