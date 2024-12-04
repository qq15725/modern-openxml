import type { BlipFill, EffectDag, EffectList, GradientFill, GroupFill, NoFill, PatternFill, SolidFill } from '../drawing'
import type { ExtensionList } from './ExtensionList'
import { defineChild, OXML } from '../../core'

export class _Properties extends OXML {
  @defineChild('p:extLst') extLst?: ExtensionList
  @defineChild('a:effectDag') effectDag?: EffectDag
  @defineChild('a:effectLst') effectLst?: EffectList
  @defineChild('a:noFill') noFill?: NoFill
  @defineChild('a:blipFill') blipFill?: BlipFill
  @defineChild('a:gradFill') gradFill?: GradientFill
  @defineChild('a:grpFill') grpFill?: GroupFill
  @defineChild('a:pattFill') pattFill?: PatternFill
  @defineChild('a:solidFill') solidFill?: SolidFill
}
