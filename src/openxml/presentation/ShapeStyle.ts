import type { EffectReference, FillReference, FontReference, LineReference } from '../drawing'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.shapestyle
 */
@defineElement('p:style')
export class ShapeStyle extends OXML {
  @defineChild('a:lnRef') declare lnRef?: LineReference
  @defineChild('a:fillRef') declare fillRef?: FillReference
  @defineChild('a:effectRef') declare effectRef?: EffectReference
  @defineChild('a:fontRef') declare fontRef?: FontReference
}
