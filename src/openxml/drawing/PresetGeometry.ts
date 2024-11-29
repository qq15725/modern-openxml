import { defineProperty } from '../../core'
import { _Namespace } from './_Namespace'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.presetgeometry
 */
export class PresetGeometry extends _Namespace {
  readonly tag = 'prstGeom'

  @defineProperty('prst', 'string') declare prst: string
}
