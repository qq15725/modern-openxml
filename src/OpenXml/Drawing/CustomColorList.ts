import type { CustomColor } from './CustomColor'
import { defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.customcolorlist
 */
@defineElement('a:custClrLst')
export class CustomColorList extends OOXML {
  override get children(): CustomColor[] {
    return super.children.filter(child => child.tag === 'custClr') as any[]
  }

  override toIDOC(): any {
    return this.children.map((child) => {
      return {
        name: child.name,
        color: child.toIDOC(),
      }
    })
  }
}
