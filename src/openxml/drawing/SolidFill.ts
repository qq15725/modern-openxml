import { defineChild } from '../../core'
import { _Namespace } from './_Namespace'
import { SchemeColor } from './SchemeColor'
import { SrgbClr } from './SrgbClr'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.solidfill
 */
export class SolidFill extends _Namespace {
  readonly tag = 'solidFill'

  @defineChild('a:srgbClr', SrgbClr) srgbClr?: SrgbClr
  @defineChild('a:schemeClr', SchemeColor) schemeClr?: SchemeColor
}
