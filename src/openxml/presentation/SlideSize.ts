import { defineProperty } from '../../core'
import { _Namespace } from './_Namespace'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slidesize
 */
export class SlideSize extends _Namespace {
  readonly tag = 'sldSz'

  @defineProperty('cx', 'emu') declare cx: number
  @defineProperty('cy', 'emu') declare cy: number
}
