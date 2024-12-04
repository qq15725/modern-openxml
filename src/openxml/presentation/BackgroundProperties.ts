import type { EffectList, GradientFill, NoFill, PatternFill, SolidFill } from '../drawing'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.backgroundproperties
 */
@defineElement('p:bgPr')
export class BackgroundProperties extends OXML {
  @defineChild('a:blipFill') declare blipFill: OXML
  @defineChild('a:effectDag') declare effectDag: OXML
  @defineChild('a:effectLst') declare effectLst: EffectList
  @defineChild('a:extLst') declare extLst: OXML
  @defineChild('a:gradFill') declare gradFill: GradientFill
  @defineChild('a:grpFill') declare grpFill: OXML
  @defineChild('a:noFill') declare noFill: NoFill
  @defineChild('a:pattFill') declare pattFill: PatternFill
  @defineChild('a:solidFill') declare solidFill: SolidFill
}
