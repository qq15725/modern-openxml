import type { EffectReference, FillReference, FontReference, LineReference } from '../drawing'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.shapestyle
 */
@defineElement('style', 'p')
export class ShapeStyle extends OXML {
  @defineChild('lnRef') lnRef?: LineReference
  @defineChild('fillRef') fillRef?: FillReference
  @defineChild('effectRef') effectRef?: EffectReference
  @defineChild('fontRef') fontRef?: FontReference
}
