import { defineChild, defineNode, XmlObject } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.gradientfill
 */
@defineNode('gradFill', 'a')
export class GradientFill extends XmlObject {
  @defineChild('a:gsLst', XmlObject) gsLst?: XmlObject
  @defineChild('a:lin', XmlObject) lin?: XmlObject
  @defineChild('a:path', XmlObject) path?: XmlObject
  @defineChild('a:tileRect', XmlObject) tileRect?: XmlObject
}
