import { defineChild } from '../../core'
import { EffectReference, FillReference, FontReference, LineReference } from '../drawing'
import { _Namespace } from './_Namespace'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.shapestyle
 */
export class ShapeStyle extends _Namespace {
  readonly tag = 'style'

  @defineChild('a:lnRef', LineReference) lnRef?: LineReference
  @defineChild('a:fillRef', FillReference) fillRef?: FillReference
  @defineChild('a:effectRef', EffectReference) effectRef?: EffectReference
  @defineChild('a:fontRef', FontReference) fontRef?: FontReference
}
