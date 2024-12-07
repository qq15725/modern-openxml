import { defineAttribute, defineElement } from '../../core'
import { _Color } from './_Color'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.linereference
 */
@defineElement('a:lnRef')
export class LineReference extends _Color {
  @defineAttribute('idx') declare idx: string
}
