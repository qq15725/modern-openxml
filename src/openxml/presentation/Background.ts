import { defineChild } from '../../core'
import { _Namespace } from './_Namespace'
import { BackgroundProperties } from './BackgroundProperties'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.background
 */
export class Background extends _Namespace {
  readonly tag = 'bg'

  @defineChild('p:bgPr', BackgroundProperties) declare bgPr: BackgroundProperties
}
