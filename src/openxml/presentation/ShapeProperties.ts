import type { OXML } from '../../core'
import type {
  CustomGeometry,
  Outline,
  PresetGeometry,
  Transform2D,
} from '../drawing'
import { defineChild, defineElement } from '../../core'
import { _Properties } from './_Properties'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.shapeproperties
 */
@defineElement('p:spPr')
export class ShapeProperties extends _Properties {
  @defineChild('a:scene3d') scene3d?: OXML
  @defineChild('a:xfrm') declare xfrm: Transform2D
  @defineChild('a:prstGeom') prstGeom?: PresetGeometry
  @defineChild('a:custGeom') custGeom?: CustomGeometry
  @defineChild('a:ln') ln?: Outline
  @defineChild('a:sp3d') sp3d?: OXML
}
