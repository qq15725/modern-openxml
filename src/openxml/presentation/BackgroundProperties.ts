import type { EffectList, GradientFill, NoFill, PatternFill, SolidFill } from '../drawing'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.backgroundproperties
 */
@defineElement('bgPr', 'p')
export class BackgroundProperties extends OXML {
  @defineChild('blipFill') declare blipFill: OXML
  @defineChild('effectDag') declare effectDag: OXML
  @defineChild('effectLst') declare effectLst: EffectList
  @defineChild('extLst') declare extLst: OXML
  @defineChild('gradFill') declare gradFill: GradientFill
  @defineChild('grpFill') declare grpFill: OXML
  @defineChild('noFill') declare noFill: NoFill
  @defineChild('pattFill') declare pattFill: PatternFill
  @defineChild('solidFill') declare solidFill: SolidFill
}
