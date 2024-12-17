import type { BlipFill } from './BlipFill'
import type { GradientFill } from './GradientFill'
import type { GroupFill } from './GroupFill'
import type { NoFill } from './NoFill'
import type { PatternFill } from './PatternFill'
import type { SolidFill } from './SolidFill'
import { OOXML } from '../../core'

export type Fill = BlipFill | GradientFill | GroupFill | NoFill | PatternFill | SolidFill

export class _FillList extends OOXML {
  get children(): Fill[] {
    return Array.from(this.element.children).map((element) => {
      switch (element.tagName) {
        case 'a:blipFill':
        case 'a:gradFill':
        case 'a:grpFill':
        case 'a:noFill':
        case 'a:pattFill':
        case 'a:solidFill':
        default:
          return OOXML.make(element)
      }
    }).filter(Boolean) as any[]
  }
}
