import { defineChild } from '../../core'
import { _Namespace } from './_Namespace'
import { GroupShape } from './GroupShape'
import { NonVisualGroupShapeProperties } from './NonVisualGroupShapeProperties'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.shapetree
 */
export class ShapeTree extends _Namespace {
  readonly tag = 'spTree'

  @defineChild('p:nvGrpSpPr', NonVisualGroupShapeProperties) declare nvGrpSpPr: NonVisualGroupShapeProperties
  @defineChild('p:grpSpPr', GroupShape) declare grpSpPr: GroupShape
}
