import { defineChild, defineNode, defineProperty, XmlObject } from '../../core'
import { Blip, SourceRectangle, Stretch, Tile } from '../drawing'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.blipfill
 */
@defineNode('blipFill', 'p')
export class BlipFill extends XmlObject {
  @defineChild('a:blip', Blip) declare blip: Blip
  @defineChild('a:srcRect', SourceRectangle) declare srcRect: SourceRectangle
  @defineChild('a:stretch', Stretch) declare stretch: Stretch
  @defineChild('a:tile', Tile) declare tile: Tile

  @defineProperty('rotWithShape', 'boolean') rotWithShape?: boolean
  @defineProperty('dpi', 'number') dpi?: number
}
