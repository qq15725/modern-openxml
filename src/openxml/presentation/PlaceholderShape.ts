import { defineProperty } from '../../core'
import { _Namespace } from './_Namespace'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.placeholdershape
 */
export class PlaceholderShape extends _Namespace {
  readonly tag = 'ph'

  @defineProperty('type', 'string') type?: string
  @defineProperty('idx', 'number') idx?: number
}
