import { defineChild } from '../../core'
import {
  CustomGeometry,
  EffectList,
  GradientFill,
  NoFill,
  Outline,
  PatternFill,
  PresetGeometry,
  SolidFill,
  Transform2D,
} from '../drawing'
import { _Namespace } from './_Namespace'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.shapeproperties
 */
export class ShapeProperties extends _Namespace {
  readonly tag = 'spPr'

  @defineChild('a:blipFill', _Namespace) blipFill?: _Namespace
  @defineChild('a:custGeom', CustomGeometry) custGeom?: CustomGeometry
  @defineChild('a:effectDag', _Namespace) effectDag?: _Namespace
  @defineChild('a:effectLst', EffectList) effectLst?: EffectList
  @defineChild('a:extLst', _Namespace) extLst?: _Namespace
  @defineChild('a:gradFill', GradientFill) gradFill?: GradientFill
  @defineChild('a:grpFill', _Namespace) grpFill?: _Namespace
  @defineChild('a:ln', Outline) ln?: Outline
  @defineChild('a:noFill', NoFill) noFill?: NoFill
  @defineChild('a:pattFill', PatternFill) pattFill?: PatternFill
  @defineChild('a:prstGeom', PresetGeometry) prstGeom?: PresetGeometry
  @defineChild('a:scene3d', _Namespace) scene3d?: _Namespace
  @defineChild('a:solidFill', SolidFill) solidFill?: SolidFill
  @defineChild('a:sp3d', _Namespace) sp3d?: _Namespace
  @defineChild('a:xfrm', Transform2D) declare xfrm: Transform2D
}
