import { defineChild } from '../../core'
import { EffectList, GradientFill, NoFill, PatternFill, SolidFill, Transform2D } from '../drawing'
import { _Namespace } from './_Namespace'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.groupshapeproperties
 */
export class GroupShapeProperties extends _Namespace {
  readonly tag = 'grpSpPr'

  @defineChild('a:blipFill', _Namespace) declare blipFill: _Namespace
  @defineChild('a:effectDag', _Namespace) declare effectDag: _Namespace
  @defineChild('a:effectLst', EffectList) declare effectLst: EffectList
  @defineChild('a:extLst', _Namespace) declare extLst: _Namespace
  @defineChild('a:gradFill', GradientFill) declare gradFill: GradientFill
  @defineChild('a:grpFill', _Namespace) declare grpFill: _Namespace
  @defineChild('a:noFill', NoFill) declare noFill: NoFill
  @defineChild('a:pattFill', PatternFill) declare pattFill: PatternFill
  @defineChild('a:scene3d', _Namespace) declare scene3d: _Namespace
  @defineChild('a:solidFill', SolidFill) declare solidFill: SolidFill
  @defineChild('a:xfrm', Transform2D) declare xfrm: Transform2D
}