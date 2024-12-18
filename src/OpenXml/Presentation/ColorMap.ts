import { defineElement } from '../../core'
import { _ColorMap } from '../Drawing'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.colormap
 */
@defineElement('p:clrMap')
export class ColorMap extends _ColorMap {
  //
}
