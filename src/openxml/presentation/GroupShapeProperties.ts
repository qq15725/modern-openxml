import type { BlipFill, EffectList, GradientFill, NoFill, PatternFill, SolidFill, Transform2D } from '../drawing'
import type { ExtensionList } from './ExtensionList'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.groupshapeproperties
 */
@defineElement('p:grpSpPr')
export class GroupShapeProperties extends OXML {
  @defineChild('a:blipFill') blipFill?: BlipFill
  @defineChild('a:effectDag') effectDag?: OXML
  @defineChild('a:effectLst') effectLst?: EffectList
  @defineChild('p:extLst') extLst?: ExtensionList
  @defineChild('a:gradFill') gradFill?: GradientFill
  @defineChild('a:grpFill') grpFill?: OXML
  @defineChild('a:noFill') noFill?: NoFill
  @defineChild('a:pattFill') pattFill?: PatternFill
  @defineChild('a:scene3d') scene3d?: OXML
  @defineChild('a:solidFill') solidFill?: SolidFill
  @defineChild('a:xfrm') xfrm?: Transform2D
}
