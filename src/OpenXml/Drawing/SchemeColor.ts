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
    let key = this.val
    const clrScheme = theme?.themeElements?.clrScheme
    let colorStyle: _ColorStyle | undefined = (clrScheme as any)?.[key]
    if (!colorStyle) {
      const clrMap = theme?.extraClrSchemeLst?.extraClrScheme?.clrMap
      const clrScheme = theme?.extraClrSchemeLst?.extraClrScheme?.clrScheme
      key = (clrMap as any)?.[key]
      colorStyle = (clrScheme as any)?.[key]
    }
    return colorStyle?.color?.toRGB() ?? { r: 0, g: 0, b: 0 }
  }
}
