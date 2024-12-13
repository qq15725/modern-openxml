import type { FillContext, FillJSON } from './_FillList'
import type { Blip } from './Blip'
import type { SourceRectangle } from './SourceRectangle'
import type { Stretch } from './Stretch'
import type { Tile } from './Tile'
import { defineAttribute, defineChild, OOXML } from '../../core'

export class _BlipFill extends OOXML {
  @defineAttribute('rotWithShape', 'boolean') declare rotWithShape?: boolean
  @defineAttribute('dpi', 'number') declare dpi?: number

  @defineChild('a:blip') declare blip?: Blip
  @defineChild('a:srcRect') declare srcRect?: SourceRectangle
  @defineChild('a:stretch') declare stretch?: Stretch
  @defineChild('a:tile') declare tile?: Tile

  override toJSON(_ctx?: FillContext): FillJSON {
    return {
      image: this.blip?.rEmbed,
    }
  }
}
