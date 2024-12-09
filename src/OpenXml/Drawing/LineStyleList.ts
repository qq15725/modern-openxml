import type { Outline } from './Outline'
import { defineElement, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.linestylelist
 */
@defineElement('a:lnStyleLst')
export class LineStyleList extends OXML {
  get children(): Outline[] {
    return Array.from(this.element.children).map((element) => {
      switch (element.tagName) {
        case 'a:ln':
        default:
          return OXML.make(element)
      }
    }).filter(Boolean) as any[]
  }
}
