import { defineChild } from '../../core'
import { SolidFill, Transform2D } from '../drawing'
import { CustomGeometry } from '../drawing/CustomGeometry'
import { PresetGeometry } from '../drawing/PresetGeometry'
import { _Namespace } from './_Namespace'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.shapeproperties
 */
export class ShapeProperties extends _Namespace {
  readonly tag = 'spPr'

  @defineChild('a:solidFill', SolidFill) solidFill?: SolidFill
  @defineChild('a:xfrm', Transform2D) declare xfrm: Transform2D
  @defineChild('a:prstGeom', PresetGeometry) prstGeom?: PresetGeometry
  @defineChild('a:custGeom', CustomGeometry) custGeom?: CustomGeometry
}
