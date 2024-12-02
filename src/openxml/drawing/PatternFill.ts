import { defineChild, defineNode, XmlObject } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.patternfill
 */
@defineNode('pattFill', 'a')
export class PatternFill extends XmlObject {
  @defineChild('a:bgClr', XmlObject) bgClr?: XmlObject
  @defineChild('a:fgClr', XmlObject) fgClr?: XmlObject
}
