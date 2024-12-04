import type { EffectReference, FillReference, FontReference, LineReference } from '../drawing'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.shapestyle
 */
@defineElement('p:style')
export class ShapeStyle extends OXML {
  @defineChild('a:lnRef') lnRef?: LineReference
  @defineChild('a:fillRef') fillRef?: FillReference
  @defineChild('a:effectRef') effectRef?: EffectReference
  @defineChild('a:fontRef') fontRef?: FontReference
}
