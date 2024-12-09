import { defineElement } from '../../core'
import { _FontList } from './_FontList'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.majorfont
 */
@defineElement('a:majorFont')
export class MajorFont extends _FontList {
  //
}
