import { defineChild, defineNode, XmlObject } from '../../core'
import { GroupShape } from './GroupShape'
import { NonVisualGroupShapeProperties } from './NonVisualGroupShapeProperties'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.shapetree
 */
@defineNode('spTree', 'p')
export class ShapeTree extends XmlObject {
  @defineChild('p:nvGrpSpPr', NonVisualGroupShapeProperties) declare nvGrpSpPr: NonVisualGroupShapeProperties
  @defineChild('p:grpSpPr', GroupShape) declare grpSpPr: GroupShape
}
