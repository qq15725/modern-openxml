import { defineAttribute, defineElement } from '../../core'
import { _ColorDefinable } from './_ColorDefinable'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.fillreference
 */
@defineElement('a:fillRef')
export class FillReference extends _ColorDefinable {
  @defineAttribute('idx') declare idx: string
}
