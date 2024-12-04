import { defineAttribute, defineElement } from '../../core'
import { _ColorDefinable } from './_ColorDefinable'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.linereference
 */
@defineElement('a:lnRef')
export class LineReference extends _ColorDefinable {
  @defineAttribute('idx') declare idx: string
}
