import { defineAttribute, defineElement } from '../../core'
import { _ColorDefinable } from './_ColorDefinable'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.fontreference
 */
@defineElement('a:fontRef')
export class FontReference extends _ColorDefinable {
  @defineAttribute('idx') declare idx: string
}
