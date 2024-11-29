import { defineProperty } from '../../core'
import { _Namespace } from './_Namespace'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.extents
 */
export class Extents extends _Namespace {
  readonly tag = 'off'

  @defineProperty('cx', 'emu') declare cx: number
  @defineProperty('cy', 'emu') declare cy: number
}
