import { defineNode, defineProperty, XmlObject } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.nonvisualshapedrawingproperties
 */
@defineNode('cNvSpPr', 'p')
export class NonVisualShapeDrawingProperties extends XmlObject {
  @defineProperty('txBox', 'boolean') txBox?: boolean
}
