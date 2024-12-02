import { defineNode, defineProperty, XmlObject } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.schemecolor
 */
@defineNode('schemeClr', 'a')
export class SchemeColor extends XmlObject {
  @defineProperty('val', 'string') declare val: string
}
