import { defineAttribute, defineElement } from '../../core'
import { _ColorStyle } from './_ColorStyle'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.fontreference
 */
@defineElement('a:fontRef')
export class FontReference extends _ColorStyle {
  @defineAttribute('idx', 'number') declare idx: number
}
