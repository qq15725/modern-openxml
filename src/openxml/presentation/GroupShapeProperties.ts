import { defineChild } from '../../core'
import { Transform2D } from '../drawing'
import { _Namespace } from './_Namespace'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.groupshapeproperties
 */
export class GroupShapeProperties extends _Namespace {
  readonly tag = 'grpSpPr'

  @defineChild('a:xfrm', Transform2D) declare xfrm: Transform2D
}
