import { defineAttribute, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.gradientfill
 */
@defineElement('a:lin')
export class LinearGradientFill extends OOXML {
  @defineAttribute('ang', 'positiveFixedAngle') declare ang: number
  @defineAttribute('scaled', 'boolean') declare scaled: number
}
