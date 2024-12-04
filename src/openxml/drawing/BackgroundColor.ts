import { defineElement } from '../../core'
import { _ColorDefinable } from './_ColorDefinable'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.backgroundcolor
 */
@defineElement('a:bgClr')
export class BackgroundColor extends _ColorDefinable {
  //
}
