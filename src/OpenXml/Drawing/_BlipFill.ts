import type { Blip } from './Blip'
import type { SourceRectangle, SourceRectangleJSON } from './SourceRectangle'
import type { Stretch } from './Stretch'
import type { Tile } from './Tile'
import { defineAttribute, defineChild, OOXML } from '../../core'

export interface BlipFillJSON {
  type: 'blipFill'
  rotateWithShape?: boolean
  dpi?: number
  src: string
  opacity?: number
  sourceRectangle?: SourceRectangleJSON
}

export class _BlipFill extends OOXML {
  @defineAttribute('rotWithShape', 'boolean') declare rotWithShape?: boolean
  @defineAttribute('dpi', 'number') declare dpi?: number

  @defineChild('a:blip') declare blip: Blip
  @defineChild('a:srcRect') declare srcRect?: SourceRectangle
  @defineChild('a:stretch') declare stretch?: Stretch
  @defineChild('a:tile') declare tile?: Tile

  override toJSON(): BlipFillJSON {
    const sourceRectangle = this.srcRect?.toJSON()
    return {
      type: 'blipFill',
      rotateWithShape: this.rotWithShape,
      dpi: this.dpi,
      src: this.blip.rEmbed,
      opacity: this.blip?.alphaModFix?.amt,
      sourceRectangle: sourceRectangle
        && Object.keys(sourceRectangle).length > 0
        ? sourceRectangle
        : undefined,
    }
  }
}
