import type { EffectList, GradientFill, NoFill, PatternFill, SolidFill, Transform2D } from '../drawing'
import type { ExtensionList } from './ExtensionList'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.groupshapeproperties
 */
@defineElement('p:grpSpPr')
export class GroupShapeProperties extends OXML {
  @defineChild('a:blipFill') declare blipFill: OXML
  @defineChild('a:effectDag') declare effectDag: OXML
  @defineChild('a:effectLst') declare effectLst: EffectList
  @defineChild('p:extLst') declare extLst: ExtensionList
  @defineChild('a:gradFill') declare gradFill: GradientFill
  @defineChild('a:grpFill') declare grpFill: OXML
  @defineChild('a:noFill') declare noFill: NoFill
  @defineChild('a:pattFill') declare pattFill: PatternFill
  @defineChild('a:scene3d') declare scene3d: OXML
  @defineChild('a:solidFill') declare solidFill: SolidFill
  @defineChild('a:xfrm') declare xfrm: Transform2D
}
