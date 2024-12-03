import type { Blip, SourceRectangle, Stretch, Tile } from '../drawing'
import { defineAttribute, defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.blipfill
 */
@defineElement('blipFill', 'p')
export class BlipFill extends OXML {
  @defineAttribute('rotWithShape', 'boolean') rotWithShape?: boolean
  @defineAttribute('dpi', 'number') dpi?: number

  @defineChild('blip') declare blip: Blip
  @defineChild('srcRect') declare srcRect: SourceRectangle
  @defineChild('stretch') declare stretch: Stretch
  @defineChild('tile') declare tile: Tile
}
