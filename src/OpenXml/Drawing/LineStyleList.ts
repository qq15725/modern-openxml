import type { Outline } from './Outline'
import { defineElement, OOXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.linestylelist
 */
@defineElement('a:lnStyleLst')
export class LineStyleList extends OOXML {
  get children(): Outline[] {
    return Array.from(this.element.children).map((element) => {
      switch (element.tagName) {
        case 'a:ln':
        default:
          return OOXML.make(element)
      }
    }).filter(Boolean) as any[]
  }
}
