import type { BlipFill } from './BlipFill'
import type { GradientFill } from './GradientFill'
import type { GroupFill } from './GroupFill'
import type { NoFill } from './NoFill'
import type { PatternFill } from './PatternFill'
import type { SolidFill } from './SolidFill'
import { OXML } from '../../core'

export class _FillStyleList extends OXML {
  get children(): (BlipFill | GradientFill | GroupFill | NoFill | PatternFill | SolidFill)[] {
    return Array.from(this.element.children).map((element) => {
      switch (element.tagName) {
        case 'a:blipFill':
        case 'a:gradFill':
        case 'a:grpFill':
        case 'a:noFill':
        case 'a:pattFill':
        case 'a:solidFill':
        default:
          return OXML.make(element)
      }
    }).filter(Boolean) as any[]
  }
}
