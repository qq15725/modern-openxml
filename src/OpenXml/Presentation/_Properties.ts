import type {
  EffectDag,
  EffectList,
} from '../Drawing'
import type { ExtensionList } from './ExtensionList'
import { defineChild } from '../../core'
import { _FillStyle } from '../Drawing'

export class _Properties extends _FillStyle {
  @defineChild('p:extLst') declare extLst?: ExtensionList
  @defineChild('a:effectDag') declare effectDag?: EffectDag
  @defineChild('a:effectLst') declare effectLst?: EffectList
}
