import { defineProperty } from '../../core'
import { _Namespace } from './_Namespace'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slideid
 */
export class SlideId extends _Namespace {
  readonly tag = 'sldId'

  @defineProperty('id', 'string') declare id: string
  @defineProperty('r:id', 'string') declare rId: string
}
