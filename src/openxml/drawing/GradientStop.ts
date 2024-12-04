import { defineAttribute, defineElement } from '../../core'
import { _ColorDefinable } from './_ColorDefinable'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.GradientStop
 */
@defineElement('a:gs')
export class GradientStop extends _ColorDefinable {
  @defineAttribute('pos', 'positiveFixedPercentage') declare pos: number
}
