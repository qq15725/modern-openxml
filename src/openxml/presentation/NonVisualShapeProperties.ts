import { defineChild, defineNode, XmlObject } from '../../core'
import { ApplicationNonVisualDrawingProperties } from './ApplicationNonVisualDrawingProperties'
import { NonVisualDrawingProperties } from './NonVisualDrawingProperties'
import { NonVisualShapeDrawingProperties } from './NonVisualShapeDrawingProperties'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.nonvisualshapeproperties
 */
@defineNode('nvSpPr', 'p')
export class NonVisualShapeProperties extends XmlObject {
  @defineChild('p:cNvPr', NonVisualDrawingProperties) declare cNvPr: NonVisualDrawingProperties
  @defineChild('p:cNvSpPr', NonVisualShapeDrawingProperties) declare cNvSpPr: NonVisualShapeDrawingProperties
  @defineChild('p:nvPr', ApplicationNonVisualDrawingProperties) declare nvPr: ApplicationNonVisualDrawingProperties
}
