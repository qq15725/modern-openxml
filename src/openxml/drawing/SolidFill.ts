import { defineElement } from '../../core'
import { _ColorDefinable } from './_ColorDefinable'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.solidfill
 */
@defineElement('a:solidFill')
export class SolidFill extends _ColorDefinable {
  //
}
