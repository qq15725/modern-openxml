import { defineAttribute, defineElement } from '../../core'
import { _Color } from './_Color'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.fillreference
 */
@defineElement('a:fillRef')
export class FillReference extends _Color {
  @defineAttribute('idx') declare idx: string
}
