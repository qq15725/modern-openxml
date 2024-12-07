import { defineElement } from '../../core'
import { _Color } from './_Color'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.foregroundcolor
 */
@defineElement('a:fgClr')
export class ForegroundColor extends _Color {
  //
}
