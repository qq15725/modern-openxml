import type { EffectList, GradientFill, NoFill, PatternFill, SolidFill, Transform2D } from '../drawing'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.groupshapeproperties
 */
@defineElement('grpSpPr', 'p')
export class GroupShapeProperties extends OXML {
  @defineChild('blipFill') declare blipFill: OXML
  @defineChild('effectDag') declare effectDag: OXML
  @defineChild('effectLst') declare effectLst: EffectList
  @defineChild('extLst') declare extLst: OXML
  @defineChild('gradFill') declare gradFill: GradientFill
  @defineChild('grpFill') declare grpFill: OXML
  @defineChild('noFill') declare noFill: NoFill
  @defineChild('pattFill') declare pattFill: PatternFill
  @defineChild('scene3d') declare scene3d: OXML
  @defineChild('solidFill') declare solidFill: SolidFill
  @defineChild('xfrm') declare xfrm: Transform2D
}
