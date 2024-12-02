import { defineNode, defineProperty, XmlObject } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.nonvisualdrawingproperties
 */
@defineNode('cNvPr', 'p')
export class NonVisualDrawingProperties extends XmlObject {
  @defineProperty('id', 'string') declare id: string
  @defineProperty('name', 'string') declare name: string
}
