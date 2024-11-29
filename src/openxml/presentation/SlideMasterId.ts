import { defineProperty } from '../../core'
import { _Namespace } from './_Namespace'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slidemasterid
 */
export class SlideMasterId extends _Namespace {
  readonly tag = 'sldMasterId'

  @defineProperty('id', 'string') declare id: string
  @defineProperty('r:id', 'string') declare rId: string
}
