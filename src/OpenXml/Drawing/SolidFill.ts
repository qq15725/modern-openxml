import type { IDOCFillDeclaration } from 'modern-idoc'
import type { Color } from './_ColorStyle'
import type { Theme } from './Theme'
import { defineElement } from '../../core'
import { _ColorStyle } from './_ColorStyle'

export interface SolidFillContext {
  theme?: Theme
  color?: Color
}

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.solidfill
 */
@defineElement('a:solidFill')
export class SolidFill extends _ColorStyle {
  override toIDOC(ctx: SolidFillContext = {}): IDOCFillDeclaration {
    const {
      color = this.color,
      theme,
    } = ctx

    return {
      color: color?.toRGBAString(theme),
    }
  }
}
