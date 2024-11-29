import { defineProperty } from '../../core'
import { _Namespace } from './_Namespace'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.nonvisualdrawingproperties
 */
export class NonVisualDrawingProperties extends _Namespace {
  readonly tag = 'cNvPr'

  @defineProperty('id', 'string') declare id: string
  @defineProperty('name', 'string') declare name: string
}
