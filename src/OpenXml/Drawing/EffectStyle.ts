import type { EffectDag } from './EffectDag'
import type { EffectList } from './EffectList'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.effectstyle
 */
@defineElement('a:effectStyle')
export class EffectStyle extends OXML {
  @defineChild('a:effectDag') declare effectDag?: EffectDag
  @defineChild('a:effectLst') declare effectLst?: EffectList
  @defineChild('a:scene3d') declare scene3d?: OXML
  @defineChild('a:sp3d') declare sp3d?: OXML
}
