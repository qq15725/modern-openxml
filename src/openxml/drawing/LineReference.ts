import { defineChild, defineNode, XmlObject } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.linereference
 */
@defineNode('lnRef', 'a')
export class LineReference extends XmlObject {
  @defineChild('hslClr', XmlObject) hslClr?: XmlObject
  @defineChild('prstClr', XmlObject) prstClr?: XmlObject
  @defineChild('schemeClr', XmlObject) schemeClr?: XmlObject
  @defineChild('scrgbClr', XmlObject) scrgbClr?: XmlObject
  @defineChild('srgbClr', XmlObject) srgbClr?: XmlObject
  @defineChild('sysClr', XmlObject) sysClr?: XmlObject
}
