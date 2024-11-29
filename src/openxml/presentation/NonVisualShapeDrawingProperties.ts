import { defineProperty } from '../../core'
import { _Namespace } from './_Namespace'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.nonvisualshapedrawingproperties
 */
export class NonVisualShapeDrawingProperties extends _Namespace {
  readonly tag = 'cNvSpPr'

  @defineProperty('txBox', 'boolean') txBox?: boolean
}
