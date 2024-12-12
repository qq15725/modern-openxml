import { defineAttribute, defineElement } from '../../core'
import { _ColorStyle } from './_ColorStyle'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.GradientStop
 */
@defineElement('a:gs')
export class GradientStop extends _ColorStyle {
  @defineAttribute('pos', 'positiveFixedPercentage') declare pos: number
}
