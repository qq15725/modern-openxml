import { defineElement } from '../../core'
import { _TextStyle } from '../Drawing'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.defaulttextstyle
 */
@defineElement('p:defaultTextStyle')
export class DefaultTextStyle extends _TextStyle {
  //
}
