import { defineChild } from '../../core'
import { _Namespace } from './_Namespace'
import { BlipFill } from './BlipFill'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.backgroundproperties
 */
export class BackgroundProperties extends _Namespace {
  readonly tag = 'bgPr'

  @defineChild('p:blipFill', BlipFill) declare blipFill: BlipFill
  // TODO
}
