import { defineElement } from '../../core'
import { _FontList } from './_FontList'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.minorfont
 */
@defineElement('a:minorFont')
export class MinorFont extends _FontList {
  //
}
