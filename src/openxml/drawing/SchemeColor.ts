import { defineProperty } from '../../core'
import { _Namespace } from './_Namespace'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.schemecolor
 */
export class SchemeColor extends _Namespace {
  readonly tag = 'schemeClr'

  @defineProperty('val', 'string') declare val: string
}
