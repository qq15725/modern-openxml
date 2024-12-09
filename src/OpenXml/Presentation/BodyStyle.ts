import { defineElement } from '../../core'
import { _TextStyle } from '../Drawing'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.bodystyle
 */
@defineElement('p:bodyStyle')
export class BodyStyle extends _TextStyle {
  //
}
