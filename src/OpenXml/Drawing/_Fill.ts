import type { BlipFill } from './BlipFill'
import type { GradientFill } from './GradientFill'
import type { GroupFill } from './GroupFill'
import type { NoFill } from './NoFill'
import type { PatternFill } from './PatternFill'
import type { SolidFill } from './SolidFill'
import { defineChild, OOXML } from '../../core'

export class _Fill extends OOXML {
  @defineChild('a:noFill') declare noFill?: NoFill
  @defineChild('a:blipFill') declare blipFill?: BlipFill
  @defineChild('a:gradFill') declare gradFill?: GradientFill
  @defineChild('a:grpFill') declare grpFill?: GroupFill
  @defineChild('a:pattFill') declare pattFill?: PatternFill
  @defineChild('a:solidFill') declare solidFill?: SolidFill

  get fillColor(): string | undefined {
    if (this.noFill) {
      return undefined
    }
    else if (this.blipFill) {
      return undefined
    }
    else if (this.gradFill) {
      // TODO
      return undefined
    }
    else if (this.grpFill) {
      // TODO
      return undefined
    }
    else if (this.pattFill) {
      // TODO
      return undefined
    }
    else if (this.solidFill) {
      return this.solidFill.color
    }
    return undefined
  }

  get fillImage(): string | undefined {
    if (this.noFill) {
      return undefined
    }
    else if (this.blipFill) {
      return this.blipFill.blip?.rEmbed
    }
    return undefined
  }
}
