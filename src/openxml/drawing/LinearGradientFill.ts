import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.gradientfill
 */
@defineElement('a:lin')
export class LinearGradientFill extends OXML {
  @defineAttribute('ang', 'positiveFixedAngle') declare ang: number
  @defineAttribute('scaled', 'boolean') declare scaled: number
}
