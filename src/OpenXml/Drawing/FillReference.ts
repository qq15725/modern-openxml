import { defineAttribute, defineElement } from '../../core'
import { _ColorStyle } from './_ColorStyle'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.fillreference
 */
@defineElement('a:fillRef')
export class FillReference extends _ColorStyle {
  @defineAttribute('idx', 'number') declare idx: number
}
