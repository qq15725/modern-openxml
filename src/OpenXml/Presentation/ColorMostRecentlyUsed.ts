import type { HslColor, PresetColor, RgbColorModelHex, SystemColor } from '../Drawing'
import type { RgbColorModelPercentage } from '../Drawing/RgbColorModelPercentage'
import type { SchemeColor } from '../Drawing/SchemeColor'
import { defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.colormostrecentlyused
 */
@defineElement('p:clrMru')
export class ColorMostRecentlyUsed extends OXML {
  get children(): (HslColor | PresetColor | SchemeColor | RgbColorModelPercentage | RgbColorModelHex | SystemColor)[] {
    return Array.from(this.element.children).map((element) => {
      switch (element.tagName) {
        case 'a:hslClr':
        case 'a:prstClr':
        case 'a:schemeClr':
        case 'a:scrgbClr':
        case 'a:srgbClr':
        case 'a:sysClr':
        default:
          return OXML.make(element)
      }
    }) as any
  }

  get colors(): string[] {
    return this.children.map(child => child.color).filter(Boolean) as string[]
  }
}
