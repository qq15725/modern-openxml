import { defineElement } from '../../core'
import { _FillList } from './_FillList'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.backgroundfillstylelist
 */
@defineElement('a:bgFillStyleLst')
export class BackgroundFillStyleList extends _FillList {
  //
}
