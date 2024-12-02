import { defineChild, defineNode, XmlObject } from '../../core'
import { EffectList, GradientFill, NoFill, PatternFill, SolidFill } from '../drawing'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.backgroundproperties
 */
@defineNode('bgPr', 'p')
export class BackgroundProperties extends XmlObject {
  @defineChild('a:blipFill', XmlObject) declare blipFill: XmlObject
  @defineChild('a:effectDag', XmlObject) declare effectDag: XmlObject
  @defineChild('a:effectLst', EffectList) declare effectLst: EffectList
  @defineChild('a:extLst', XmlObject) declare extLst: XmlObject
  @defineChild('a:gradFill', GradientFill) declare gradFill: GradientFill
  @defineChild('a:grpFill', XmlObject) declare grpFill: XmlObject
  @defineChild('a:noFill', NoFill) declare noFill: NoFill
  @defineChild('a:pattFill', PatternFill) declare pattFill: PatternFill
  @defineChild('a:solidFill', SolidFill) declare solidFill: SolidFill
}
