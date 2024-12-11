import type { EffectReference, FillReference, FontReference, LineReference } from '../Drawing'
import { defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.shapestyle
 */
@defineElement('p:style')
export class ShapeStyle extends OOXML {
  @defineChild('a:lnRef') declare lnRef?: LineReference
  @defineChild('a:fillRef') declare fillRef?: FillReference
  @defineChild('a:effectRef') declare effectRef?: EffectReference
  @defineChild('a:fontRef') declare fontRef?: FontReference
}
