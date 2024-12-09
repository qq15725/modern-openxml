import type { CustomColor } from './CustomColor'
import { defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.customcolorlist
 */
@defineElement('a:custClrLst')
export class CustomColorList extends OXML {
  get children(): CustomColor[] {
    return Array.from(this.element.children).map((element) => {
      switch (element.tagName) {
        case 'a:custClr':
        default:
          return OXML.make(element)
      }
    }).filter(Boolean) as any[]
  }

  override toJSON(): any {
    return this.children.map((child) => {
      return {
        name: child.name,
        color: child.color,
      }
    })
  }
}
