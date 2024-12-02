import { defineChild, defineNode, XmlObject } from '../../core'
import { ApplicationNonVisualDrawingProperties } from './ApplicationNonVisualDrawingProperties'
import { NonVisualDrawingProperties } from './NonVisualDrawingProperties'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.nonvisualgroupshapeproperties
 */
@defineNode('nvGrpSpPr', 'p')
export class NonVisualGroupShapeProperties extends XmlObject {
  @defineChild('p:cNvPr', NonVisualDrawingProperties) declare cNvPr: NonVisualDrawingProperties
  @defineChild('p:cNvGrpSpPr', XmlObject) declare cNvGrpSpPr: XmlObject
  @defineChild('p:nvPr', ApplicationNonVisualDrawingProperties) declare nvPr: ApplicationNonVisualDrawingProperties
}
