import { defineChild } from '../../core'
import { MasterColorMapping } from '../drawing'
import { _Namespace } from './_Namespace'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.colormapoverride
 */
export class ColorMapOverride extends _Namespace {
  readonly tag = 'clrMapOvr'

  @defineChild('a:masterClrMapping', MasterColorMapping) declare masterClrMapping: MasterColorMapping
}
