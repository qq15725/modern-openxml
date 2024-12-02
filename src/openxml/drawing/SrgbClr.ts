import { defineChild, defineNode, defineProperty, XmlObject } from '../../core'
import { Alpha } from './Alpha'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.srgbclr
 */
@defineNode('srgbClr', 'a')
export class SrgbClr extends XmlObject {
  @defineProperty('val', 'string') declare val: string

  @defineChild('a:alpha', Alpha) alpha?: Alpha
}
