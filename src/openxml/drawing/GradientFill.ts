import { defineChild } from '../../core'
import { _Namespace } from './_Namespace'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.gradientfill
 */
export class GradientFill extends _Namespace {
  readonly tag = 'gradFill'

  @defineChild('a:gsLst', _Namespace) gsLst?: _Namespace
  @defineChild('a:lin', _Namespace) lin?: _Namespace
  @defineChild('a:path', _Namespace) path?: _Namespace
  @defineChild('a:tileRect', _Namespace) tileRect?: _Namespace
}
