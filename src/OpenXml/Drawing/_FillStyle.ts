import type { BlipFill } from './BlipFill'
import type { GradientFill } from './GradientFill'
import type { GroupFill } from './GroupFill'
import type { NoFill } from './NoFill'
import type { PatternFill } from './PatternFill'
import type { SolidFill } from './SolidFill'
import type { Theme } from './Theme'
import { defineChild, OOXML } from '../../core'

export interface ParsedFill {
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

  get color(): string | undefined { return this.getFill()?.color }

  getFill(theme?: Theme): ParsedFill {
    const parsed: ParsedFill = {}
    if (!this.noFill) {
      if (this.grpFill) {
        // TODO
      }
      else {
        if (this.blipFill) {
          // TODO
          parsed.image = this.blipFill.blip?.rEmbed
        }
        if (this.gradFill) {
          // TODO
        }
        else if (this.pattFill) {
          // TODO
        }
        else if (this.solidFill) {
          parsed.color = this.solidFill.color?.toRGBAString(theme)
        }
      }
    }
    return parsed
  }
}
