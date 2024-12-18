import { defineElement } from '../../core'
import { _ColorMap } from './_ColorMap'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.colormap
 */
@defineElement('a:clrMap')
export class ColorMap extends _ColorMap {
  //
}
