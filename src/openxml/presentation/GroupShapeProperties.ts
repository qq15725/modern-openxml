import { defineChild, defineNode, XmlObject } from '../../core'
import { EffectList, GradientFill, NoFill, PatternFill, SolidFill, Transform2D } from '../drawing'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.groupshapeproperties
 */
@defineNode('grpSpPr', 'p')
export class GroupShapeProperties extends XmlObject {
  @defineChild('a:blipFill', XmlObject) declare blipFill: XmlObject
  @defineChild('a:effectDag', XmlObject) declare effectDag: XmlObject
  @defineChild('a:effectLst', EffectList) declare effectLst: EffectList
  @defineChild('a:extLst', XmlObject) declare extLst: XmlObject
  @defineChild('a:gradFill', GradientFill) declare gradFill: GradientFill
  @defineChild('a:grpFill', XmlObject) declare grpFill: XmlObject
  @defineChild('a:noFill', NoFill) declare noFill: NoFill
  @defineChild('a:pattFill', PatternFill) declare pattFill: PatternFill
  @defineChild('a:scene3d', XmlObject) declare scene3d: XmlObject
  @defineChild('a:solidFill', SolidFill) declare solidFill: SolidFill
  @defineChild('a:xfrm', Transform2D) declare xfrm: Transform2D
}
