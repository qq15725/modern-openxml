import { defineAttribute, defineElement } from '../../core'
import { _ColorDefinable } from './_ColorDefinable'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.effectreference
 */
@defineElement('a:effectRef')
export class EffectReference extends _ColorDefinable {
  @defineAttribute('idx') declare idx: string
}
