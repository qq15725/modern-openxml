import { defineChild, defineProperty } from '../../core'
import { Blip, SourceRectangle, Stretch, Tile } from '../drawing'
import { _Namespace } from './_Namespace'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.blipfill
 */
export class BlipFill extends _Namespace {
  readonly tag = 'blipFill'

  @defineChild('a:blip', Blip) declare blip: Blip
  @defineChild('a:srcRect', SourceRectangle) declare srcRect: SourceRectangle
  @defineChild('a:stretch', Stretch) declare stretch: Stretch
  @defineChild('a:tile', Tile) declare tile: Tile

  @defineProperty('rotWithShape', 'boolean') rotWithShape?: boolean
  @defineProperty('dpi', 'number') dpi?: number
}
