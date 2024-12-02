import { defineChild, defineNode, XmlObject } from '../../core'
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

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.shapeproperties
 */
@defineNode('spPr', 'p')
export class ShapeProperties extends XmlObject {
  @defineChild('a:blipFill', XmlObject) blipFill?: XmlObject
  @defineChild('a:custGeom', CustomGeometry) custGeom?: CustomGeometry
  @defineChild('a:effectDag', XmlObject) effectDag?: XmlObject
  @defineChild('a:effectLst', EffectList) effectLst?: EffectList
  @defineChild('a:extLst', XmlObject) extLst?: XmlObject
  @defineChild('a:gradFill', GradientFill) gradFill?: GradientFill
  @defineChild('a:grpFill', XmlObject) grpFill?: XmlObject
  @defineChild('a:ln', Outline) ln?: Outline
  @defineChild('a:noFill', NoFill) noFill?: NoFill
  @defineChild('a:pattFill', PatternFill) pattFill?: PatternFill
  @defineChild('a:prstGeom', PresetGeometry) prstGeom?: PresetGeometry
  @defineChild('a:scene3d', XmlObject) scene3d?: XmlObject
  @defineChild('a:solidFill', SolidFill) solidFill?: SolidFill
  @defineChild('a:sp3d', XmlObject) sp3d?: XmlObject
  @defineChild('a:xfrm', Transform2D) declare xfrm: Transform2D
}
