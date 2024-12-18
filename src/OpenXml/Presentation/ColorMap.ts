import { defineElement } from '../../core'
import { ColorMap as _ColorMap } from '../Drawing'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.colormap
 */
@defineElement('p:clrMap')
export class ColorMap extends _ColorMap {
  //
}
