import { defineChild } from '../../core'
import { _Namespace } from './_Namespace'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.effectreference
 */
export class EffectReference extends _Namespace {
  readonly tag = 'effectRef'

  @defineChild('hslClr', _Namespace) hslClr?: _Namespace
  @defineChild('prstClr', _Namespace) prstClr?: _Namespace
  @defineChild('schemeClr', _Namespace) schemeClr?: _Namespace
  @defineChild('scrgbClr', _Namespace) scrgbClr?: _Namespace
  @defineChild('srgbClr', _Namespace) srgbClr?: _Namespace
  @defineChild('sysClr', _Namespace) sysClr?: _Namespace
}
