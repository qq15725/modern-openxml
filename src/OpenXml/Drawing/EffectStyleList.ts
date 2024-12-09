import type { EffectStyle } from './EffectStyle'
import { defineElement, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.effectstylelist
 */
@defineElement('a:effectStyleLst')
export class EffectStyleList extends OXML {
  get children(): EffectStyle[] {
    return Array.from(this.element.children).map((element) => {
      switch (element.tagName) {
        case 'a:effectStyle':
        default:
          return OXML.make(element)
      }
    }).filter(Boolean) as any[]
  }
}
