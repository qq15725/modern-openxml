import type { EffectStyle } from './EffectStyle'
import { defineElement, OOXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.effectstylelist
 */
@defineElement('a:effectStyleLst')
export class EffectStyleList extends OOXML {
  get children(): EffectStyle[] {
    return Array.from(this.element.children).map((element) => {
      switch (element.tagName) {
        case 'a:effectStyle':
        default:
          return OOXML.make(element)
      }
    }).filter(Boolean) as any[]
  }
}
