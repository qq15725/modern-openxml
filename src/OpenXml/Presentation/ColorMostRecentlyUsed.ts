import type { Color, Theme } from '../Drawing'
import { defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.colormostrecentlyused
 */
@defineElement('p:clrMru')
export class ColorMostRecentlyUsed extends OOXML {
  override get children(): Color[] {
    return super.children.filter((child) => {
      switch (child.tag) {
        case 'hslClr':
        case 'prstClr':
        case 'schemeClr':
        case 'scrgbClr':
        case 'srgbClr':
        case 'sysClr':
          return true
        default:
          return false
      }
    }) as any[]
  }

  toIDOC(ctx?: { theme?: Theme }): string[] {
    return this.children.map(child => child.toIDOC(ctx))
  }
}
