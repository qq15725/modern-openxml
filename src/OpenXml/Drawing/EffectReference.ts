import { defineAttribute, defineElement } from '../../core'
import { _ColorStyle } from './_ColorStyle'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.effectreference
 */
@defineElement('a:effectRef')
export class EffectReference extends _ColorStyle {
  @defineAttribute('idx', 'number') declare idx: number
}
