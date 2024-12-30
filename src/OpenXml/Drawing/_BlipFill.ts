import type { IDOCFillDeclaration } from 'modern-idoc'
import type { Blip } from './Blip'
import type { IDOCSourceRectangle, SourceRectangle } from './SourceRectangle'
import type { Stretch } from './Stretch'
import type { Tile } from './Tile'
import { defineAttribute, defineChild, OOXML } from '../../core'

export interface IDOCBlipFill extends IDOCFillDeclaration {
  rotateWithShape?: boolean
  dpi?: number
  sourceRectangle?: IDOCSourceRectangle
}

export class _BlipFill extends OOXML {
  @defineAttribute('rotWithShape', 'boolean') declare rotWithShape?: boolean
  @defineAttribute('dpi', 'number') declare dpi?: number

  @defineChild('a:blip') declare blip: Blip
  @defineChild('a:srcRect') declare srcRect?: SourceRectangle
  @defineChild('a:stretch') declare stretch?: Stretch
  @defineChild('a:tile') declare tile?: Tile

  override toIDOC(): IDOCBlipFill {
    const sourceRectangle = this.srcRect?.toIDOC()
    return {
      rotateWithShape: this.rotWithShape,
      dpi: this.dpi,
      url: this.blip.rEmbed,
      opacity: this.blip?.alphaModFix?.amt,
      sourceRectangle: sourceRectangle
        && Object.keys(sourceRectangle).length > 0
        ? sourceRectangle
        : undefined,
    }
  }
}
