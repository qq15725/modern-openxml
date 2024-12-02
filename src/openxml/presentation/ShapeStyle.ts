import { defineChild, defineNode, XmlObject } from '../../core'
import { EffectReference, FillReference, FontReference, LineReference } from '../drawing'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.shapestyle
 */
@defineNode('style', 'p')
export class ShapeStyle extends XmlObject {
  @defineChild('a:lnRef', LineReference) lnRef?: LineReference
  @defineChild('a:fillRef', FillReference) fillRef?: FillReference
  @defineChild('a:effectRef', EffectReference) effectRef?: EffectReference
  @defineChild('a:fontRef', FontReference) fontRef?: FontReference
}
