import type { OXML } from '../../core'
import type { TextCapsValues, TextStrikeValues, TextUnderlineValues } from './_types'
import type { ComplexScriptFont } from './ComplexScriptFont'
import type { EastAsianFont } from './EastAsianFont'
import type { EffectDag } from './EffectDag'
import type { EffectList } from './EffectList'
import type { ExtensionList } from './ExtensionList'
import type { LatinFont } from './LatinFont'
import type { LineSpacing } from './LineSpacing'
import type { Outline } from './Outline'
import type { SymbolFont } from './SymbolFont'
import { defineAttribute, defineChild } from '../../core'
import { _Fill } from './_Fill'

export class _RunProperties extends _Fill {
  @defineAttribute('altLang') declare altLang?: string
  @defineAttribute('baseline', 'number') declare baseline?: number
  @defineAttribute('b', 'boolean') declare b?: boolean
  @defineAttribute('bmk') declare bmk?: string
  @defineAttribute('cap') declare cap?: TextCapsValues
  @defineAttribute('dirty', 'boolean') declare dirty?: boolean
  @defineAttribute('sz', 'fontSize') declare sz?: number
  @defineAttribute('i', 'boolean') declare i?: boolean
  @defineAttribute('kern', 'emu') declare kern?: string
  @defineAttribute('kumimoji', 'boolean') declare kumimoji?: boolean
  @defineAttribute('lang') declare lang?: string
  @defineAttribute('noProof', 'boolean') declare noProof?: boolean
  @defineAttribute('normalizeH', 'boolean') declare normalizeH?: boolean
  @defineAttribute('smtClean', 'boolean') declare smtClean?: boolean
  @defineAttribute('smtId', 'number') declare smtId?: number
  @defineAttribute('spc', 'fontSize') declare spc?: number
  @defineAttribute('err', 'boolean') declare err?: boolean
  @defineAttribute('strike') declare strike?: TextStrikeValues
  @defineAttribute('u') declare u?: TextUnderlineValues

  @defineChild('a:cs') declare cs?: ComplexScriptFont
  @defineChild('a:ea') declare ea?: EastAsianFont
  @defineChild('a:effectDag') declare effectDag?: EffectDag
  @defineChild('a:effectLst') declare effectLst?: EffectList
  @defineChild('a:extLst') declare extLst?: ExtensionList
  @defineChild('a:highlight') declare highlight?: OXML
  @defineChild('a:hlinkClick') declare hlinkClick?: OXML
  @defineChild('a:hlinkMouseOver') declare hlinkMouseOver?: OXML
  @defineChild('a:latin') declare latin?: LatinFont
  @defineChild('a:ln') declare ln?: Outline
  @defineChild('a:rtl') declare rtl?: OXML
  @defineChild('a:sym') declare sym?: SymbolFont
  @defineChild('a:uFill') declare uFill?: OXML
  @defineChild('a:uFillTx') declare uFillTx?: OXML
  @defineChild('a:uLn') declare uLn?: OXML
  @defineChild('a:uLnTx') declare uLnTx?: OXML
  @defineChild('a:lnSpc') declare lnSpc?: LineSpacing
}
