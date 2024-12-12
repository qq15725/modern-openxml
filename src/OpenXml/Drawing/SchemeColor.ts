import type { RGB } from './_Color'
import type { _ColorStyle } from './_ColorStyle'
import type { Theme } from './Theme'
import { defineAttribute, defineElement } from '../../core'
import { _Color } from './_Color'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.schemecolor
 */
@defineElement('a:schemeClr')
export class SchemeColor extends _Color {
  @defineAttribute('val') declare val: string

  override toRGB(theme?: Theme): RGB {
    const colorStyle = (theme as any)?.clrScheme[this.val] as _ColorStyle | undefined
    return colorStyle?.color?.toRGB() ?? { r: 0, g: 0, b: 0 }
  }
}
