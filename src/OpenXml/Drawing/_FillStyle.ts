import type { Fill } from './_FillList'
import type { Theme } from './Theme'
import { defineChild, OOXML } from '../../core'
import { BlipFill } from './BlipFill'
import { GradientFill } from './GradientFill'
import { GroupFill } from './GroupFill'
import { NoFill } from './NoFill'
import { PatternFill } from './PatternFill'
import { SolidFill } from './SolidFill'

export interface FillJSON {
  color?: string
  image?: string
}

export class _FillStyle extends OOXML {
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
    return this.toFillJSON().color
  }

  toFillJSON(ctx: { theme?: Theme } = {}): FillJSON {
    const { theme } = ctx
    const fill = this.fill
    const res: FillJSON = {}
    if (!(fill instanceof NoFill)) {
      if (fill instanceof GroupFill) {
        // TODO
      }
      else {
        if (fill instanceof BlipFill) {
          // TODO
          res.image = fill.blip?.rEmbed
        }
        if (fill instanceof GradientFill) {
          // TODO
        }
        else if (fill instanceof PatternFill) {
          // TODO
        }
        else if (fill instanceof SolidFill) {
          res.color = fill.color?.toRGBAString(theme)
        }
      }
    }
    return res
  }
}
