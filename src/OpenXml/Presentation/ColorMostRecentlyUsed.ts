import type { Color, Theme } from '../Drawing'
import { defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.colormostrecentlyused
 */
@defineElement('p:clrMru')
export class ColorMostRecentlyUsed extends OOXML {
  get children(): Color[] {
    return Array.from(this.element.children).map((element) => {
      switch (element.tagName) {
        case 'a:hslClr':
        case 'a:prstClr':
        case 'a:schemeClr':
        case 'a:scrgbClr':
        case 'a:srgbClr':
        case 'a:sysClr':
        default:
          return OOXML.make(element)
      }
    }) as any
  }

  toJSON(ctx?: { theme?: Theme }): string[] {
    return this.children.map(child => child.toJSON(ctx))
  }
}
