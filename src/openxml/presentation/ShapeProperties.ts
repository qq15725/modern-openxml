import type {
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
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.shapeproperties
 */
@defineElement('spPr', 'p')
export class ShapeProperties extends OXML {
  @defineChild('blipFill') blipFill?: OXML
  @defineChild('custGeom') custGeom?: CustomGeometry
  @defineChild('effectDag') effectDag?: OXML
  @defineChild('effectLst') effectLst?: EffectList
  @defineChild('extLst') extLst?: OXML
  @defineChild('gradFill') gradFill?: GradientFill
  @defineChild('grpFill') grpFill?: OXML
  @defineChild('ln') ln?: Outline
  @defineChild('noFill') noFill?: NoFill
  @defineChild('pattFill') pattFill?: PatternFill
  @defineChild('prstGeom') prstGeom?: PresetGeometry
  @defineChild('scene3d') scene3d?: OXML
  @defineChild('solidFill') solidFill?: SolidFill
  @defineChild('sp3d') sp3d?: OXML
  @defineChild('xfrm') declare xfrm: Transform2D
}
