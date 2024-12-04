import { defineAttribute, defineElement } from '../../core'
import { _Color } from './_Color'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.GradientStop
 */
@defineElement('a:gs')
export class GradientStop extends _Color {
  @defineAttribute('pos', 'positiveFixedPercentage') declare pos: number
}
