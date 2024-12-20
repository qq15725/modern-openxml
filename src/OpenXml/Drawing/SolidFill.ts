import type { Color } from './_ColorStyle'
import type { Theme } from './Theme'
import { defineElement } from '../../core'
import { _ColorStyle } from './_ColorStyle'

export interface SolidFillContext {
  theme?: Theme
  color?: Color
}

export interface SolidFillJSON {
  type: 'solidFill'
  color?: string
}

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.solidfill
 */
@defineElement('a:solidFill')
export class SolidFill extends _ColorStyle {
  override toJSON(ctx: SolidFillContext = {}): SolidFillJSON {
    const {
      color = this.color,
      theme,
    } = ctx

    return {
      type: 'solidFill',
      color: color?.toRGBAString(theme),
    }
  }
}
