import type { BlipFillJSON } from './_BlipFill'
import type { BlipFill } from './BlipFill'
import type { GradientFill, GradientFillJSON } from './GradientFill'
import type { GroupFill, GroupFillJSON } from './GroupFill'
import type { NoFill, NoFillJSON } from './NoFill'
import type { PatternFill, PatternFillJSON } from './PatternFill'
import type { SolidFill, SolidFillJSON } from './SolidFill'
import { OOXML } from '../../core'

export type Fill =
  | BlipFill
  | GradientFill
  | GroupFill
  | NoFill
  | PatternFill
  | SolidFill

export type FillJSON =
  | BlipFillJSON
  | GradientFillJSON
  | GroupFillJSON
  | NoFillJSON
  | PatternFillJSON
  | SolidFillJSON

export abstract class _FillList extends OOXML {
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
