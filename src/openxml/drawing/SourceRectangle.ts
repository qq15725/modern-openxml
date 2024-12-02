import { defineProperty } from '../../core'
import { _Namespace } from './_Namespace'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.sourcerectangle
 */
export class SourceRectangle extends _Namespace {
  readonly tag = 'srcRect'

  @defineProperty('b', 'rate') declare b: number
  @defineProperty('l', 'rate') declare l: number
  @defineProperty('r', 'rate') declare r: number
  @defineProperty('t', 'rate') declare t: number
}
