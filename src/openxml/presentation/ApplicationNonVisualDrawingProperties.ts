import { defineChild, defineNode, XmlObject } from '../../core'
import { PlaceholderShape } from './PlaceholderShape'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.applicationnonvisualdrawingproperties
 */
@defineNode('nvPr', 'p')
export class ApplicationNonVisualDrawingProperties extends XmlObject {
  @defineChild('p:ph', PlaceholderShape) declare ph: PlaceholderShape
}
