import { defineProperty } from '../../core'
import { _Namespace } from './_Namespace'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.alpha
 */
export class Alpha extends _Namespace {
  readonly tag = 'alpha'

  @defineProperty('val', 'string') declare val: string
}
