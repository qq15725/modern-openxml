import { defineElement } from '../../core'
import { _FillStyleList } from './_FillStyleList'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.backgroundfillstylelist
 */
@defineElement('a:bgFillStyleLst')
export class BackgroundFillStyleList extends _FillStyleList {
  //
}