import { defineChild, defineElement, OXML } from '../../core'
import { GroupShape } from './GroupShape'
import { NonVisualGroupShapeProperties } from './NonVisualGroupShapeProperties'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.shapetree
 */
@defineElement('spTree', 'p')
export class ShapeTree extends OXML {
  @defineChild('nvGrpSpPr', NonVisualGroupShapeProperties) declare nvGrpSpPr: NonVisualGroupShapeProperties
  @defineChild('grpSpPr', GroupShape) declare grpSpPr: GroupShape
}
