import { defineAttribute, defineElement } from '../../core'
import { _Color } from './_Color'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.fontreference
 */
@defineElement('a:fontRef')
export class FontReference extends _Color {
  @defineAttribute('idx') declare idx: string
}
