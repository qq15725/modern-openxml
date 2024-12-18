import type { Fill } from './_FillList'
import type { BlipFill } from './BlipFill'
import type { GradientFill } from './GradientFill'
import type { GroupFill } from './GroupFill'
import type { NoFill } from './NoFill'
import type { PatternFill } from './PatternFill'
import type { SolidFill } from './SolidFill'
import { defineChild, OOXML } from '../../core'

export abstract class _FillStyle extends OOXML {
  @defineChild('a:noFill') declare noFill?: NoFill
  @defineChild('a:blipFill') declare blipFill?: BlipFill
  @defineChild('a:gradFill') declare gradFill?: GradientFill
  @defineChild('a:grpFill') declare grpFill?: GroupFill
  @defineChild('a:pattFill') declare pattFill?: PatternFill
  @defineChild('a:solidFill') declare solidFill?: SolidFill

  get fill(): Fill | undefined {
    return this.noFill
      ?? this.blipFill
      ?? this.gradFill
      ?? this.grpFill
      ?? this.pattFill
      ?? this.solidFill
  }

  get fillColor(): string | undefined {
    return this.fill?.toJSON().color
  }

  get fillImage(): string | undefined {
    return this.fill?.toJSON().image
  }
}
