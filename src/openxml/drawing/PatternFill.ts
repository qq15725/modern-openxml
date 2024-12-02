import { defineChild } from '../../core'
import { _Namespace } from './_Namespace'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.patternfill
 */
export class PatternFill extends _Namespace {
  readonly tag = 'pattFill'

  @defineChild('a:bgClr', _Namespace) bgClr?: _Namespace
  @defineChild('a:fgClr', _Namespace) fgClr?: _Namespace
}
