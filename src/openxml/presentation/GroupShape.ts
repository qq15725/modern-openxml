import { defineChild, defineNode, XmlObject } from '../../core'
import { GroupShapeProperties } from './GroupShapeProperties'
import { NonVisualGroupShapeProperties } from './NonVisualGroupShapeProperties'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.groupshape
 */
@defineNode('grpSp', 'p')
export class GroupShape extends XmlObject {
  @defineChild('p:nvGrpSpPr', NonVisualGroupShapeProperties) declare nvGrpSpPr: NonVisualGroupShapeProperties
  @defineChild('p:grpSpPr', GroupShapeProperties) declare grpSpPr: GroupShapeProperties
}
