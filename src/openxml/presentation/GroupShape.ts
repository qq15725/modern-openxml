import { defineChild } from '../../core'
import { _Namespace } from './_Namespace'
import { GroupShapeProperties } from './GroupShapeProperties'
import { NonVisualGroupShapeProperties } from './NonVisualGroupShapeProperties'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.groupshape
 */
export class GroupShape extends _Namespace {
  readonly tag = 'grpSp'

  @defineChild('p:nvGrpSpPr', NonVisualGroupShapeProperties) declare nvGrpSpPr: NonVisualGroupShapeProperties
  @defineChild('p:grpSpPr', GroupShapeProperties) declare grpSpPr: GroupShapeProperties
}
