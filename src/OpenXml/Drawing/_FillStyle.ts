import type { _Fill } from './_FillList'
import type { Theme } from './Theme'
import { OOXML } from '../../core'
import { BlipFill } from './BlipFill'
import { GradientFill } from './GradientFill'
import { GroupFill } from './GroupFill'
import { NoFill } from './NoFill'
import { PatternFill } from './PatternFill'
import { SolidFill } from './SolidFill'

export interface ParsedFill {
  color?: string
  image?: string
}

export class _FillStyle extends OOXML {
  get fill(): _Fill | undefined {
    const element = this.element.children[0]
    if (element) {
      switch (element?.tagName) {
        case 'a:noFill':
        case 'a:blipFill':
        case 'a:gradFill':
        case 'a:grpFill':
        case 'a:pattFill':
        case 'a:solidFill':
        default:
          return OOXML.make(element)
      }
    }
    return undefined
  }

  static parseFill(fill?: _Fill, theme?: Theme): ParsedFill {
    const parsed: ParsedFill = {}
    if (fill instanceof NoFill) {
      if (fill instanceof GroupFill) {
        // TODO
      }
      else {
        if (fill instanceof BlipFill) {
          // TODO
          parsed.image = fill.blip?.rEmbed
        }
        if (fill instanceof GradientFill) {
          // TODO
        }
        else if (fill instanceof PatternFill) {
          // TODO
        }
        else if (fill instanceof SolidFill) {
          parsed.color = fill.color?.toRGBAString(theme)
        }
      }
    }
    return parsed
  }
}
