import { defineChild, defineProperty } from '../../core'
import { _Namespace } from './_Namespace'
import { Alpha } from './Alpha'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.srgbclr
 */
export class SrgbClr extends _Namespace {
  readonly tag = 'srgbClr'

  @defineProperty('val', 'string') declare val: string

  @defineChild('a:alpha', Alpha) alpha?: Alpha
}
