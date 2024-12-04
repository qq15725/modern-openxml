import type {
  BlipFill,
  CustomGeometry,
  EffectList,
  ExtensionList,
  GradientFill,
  NoFill,
  Outline,
  PatternFill,
  PresetGeometry,
  SolidFill,
  Transform2D,
} from '../drawing'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.shapeproperties
 */
@defineElement('p:spPr')
export class ShapeProperties extends OXML {
  @defineChild('a:blipFill') blipFill?: BlipFill
  @defineChild('a:custGeom') custGeom?: CustomGeometry
  @defineChild('a:effectDag') effectDag?: OXML
  @defineChild('a:effectLst') effectLst?: EffectList
  @defineChild('a:extLst') extLst?: ExtensionList
  @defineChild('a:gradFill') gradFill?: GradientFill
  @defineChild('a:grpFill') grpFill?: OXML
  @defineChild('a:ln') ln?: Outline
  @defineChild('a:noFill') noFill?: NoFill
  @defineChild('a:pattFill') pattFill?: PatternFill
  @defineChild('a:prstGeom') prstGeom?: PresetGeometry
  @defineChild('a:scene3d') scene3d?: OXML
  @defineChild('a:solidFill') solidFill?: SolidFill
  @defineChild('a:sp3d') sp3d?: OXML
  @defineChild('a:xfrm') declare xfrm: Transform2D
}
