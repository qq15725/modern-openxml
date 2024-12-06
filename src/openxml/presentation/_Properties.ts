import type {
  EffectDag,
  EffectList,
} from '../drawing'
import type { ExtensionList } from './ExtensionList'
import { defineChild } from '../../core'
import { _Fill } from '../drawing'

export class _Properties extends _Fill {
  @defineChild('p:extLst') declare extLst?: ExtensionList
  @defineChild('a:effectDag') declare effectDag?: EffectDag
  @defineChild('a:effectLst') declare effectLst?: EffectList
}
