import { defineChild } from '../../core'
import { Blip, Stretch } from '../drawing'
import { _Namespace } from './_Namespace'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.blipfill
 */
export class BlipFill extends _Namespace {
  readonly tag = 'blipFill'

  @defineChild('a:blip', Blip) declare blip: Blip
  @defineChild('a:stretch', Stretch) declare stretch: Stretch
}
