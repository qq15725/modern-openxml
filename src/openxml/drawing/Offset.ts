import { defineProperty } from '../../core'
import { _Namespace } from './_Namespace'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.offset
 */
export class Offset extends _Namespace {
  readonly tag = 'off'

  @defineProperty('x', 'emu') declare x: number
  @defineProperty('y', 'emu') declare y: number
}
