import type { Blip, SourceRectangle, Stretch, Tile } from '../drawing'
import { defineChild, defineElement, defineProperty, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.blipfill
 */
@defineElement('blipFill', 'p')
export class BlipFill extends OXML {
  @defineProperty('rotWithShape', 'boolean') rotWithShape?: boolean
  @defineProperty('dpi', 'number') dpi?: number

  @defineChild('blip') declare blip: Blip
  @defineChild('srcRect') declare srcRect: SourceRectangle
  @defineChild('stretch') declare stretch: Stretch
  @defineChild('tile') declare tile: Tile
}
