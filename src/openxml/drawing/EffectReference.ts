import { defineAttribute, defineElement } from '../../core'
import { _Color } from './_Color'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.effectreference
 */
@defineElement('a:effectRef')
export class EffectReference extends _Color {
  @defineAttribute('idx') declare idx: string
}
