import type { GroupShape } from './GroupShape'
import type { NonVisualGroupShapeProperties } from './NonVisualGroupShapeProperties'
import { defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.shapetree
 */
@defineElement('p:spTree')
export class ShapeTree extends OOXML {
  @defineChild('p:nvGrpSpPr') declare nvGrpSpPr: NonVisualGroupShapeProperties
  @defineChild('p:grpSpPr') declare grpSpPr: GroupShape
}
