import type { OOXML } from '../../core'
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
import { defineAttribute, defineChild, defineProperty } from '../../core'
import { _FillStyle } from './_FillStyle'

export class _RunProperties extends _FillStyle {
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
  @defineChild('a:highlight') declare highlight?: OOXML
  @defineChild('a:hlinkClick') declare hlinkClick?: OOXML
  @defineChild('a:hlinkMouseOver') declare hlinkMouseOver?: OOXML
  @defineChild('a:latin') declare latin?: LatinFont
  @defineChild('a:ln') declare ln?: Outline
  @defineChild('a:rtl') declare rtl?: OOXML
  @defineChild('a:sym') declare sym?: SymbolFont
  @defineChild('a:uFill') declare uFill?: OOXML
  @defineChild('a:uFillTx') declare uFillTx?: OOXML
  @defineChild('a:uLn') declare uLn?: OOXML
  @defineChild('a:uLnTx') declare uLnTx?: OOXML
  @defineChild('a:lnSpc') declare lnSpc?: LineSpacing

  @defineProperty('sz') declare fontSize?: number
  @defineProperty('spc') declare letterSpacing?: number
  @defineProperty('lnSpc.spcPct.val') declare lineHeight?: number

  get fontFamily(): string | undefined {
    return this.cs?.typeface
      ?? this.ea?.typeface
      ?? this.latin?.typeface
      ?? this.sym?.typeface
  }

  get fontWeight(): 700 | undefined {
    switch (this.b) {
      case true:
        return 700
      default:
        return undefined
    }
  }

  get fontStyle(): 'italic' | undefined {
    switch (this.i) {
      case true:
        return 'italic'
      default:
        return undefined
    }
  }

  get textTransform(): 'uppercase' | 'lowercase' | undefined {
    switch (this.cap) {
      case 'all':
        return 'uppercase'
      case 'small':
        return 'lowercase'
      case 'none':
      default:
        return undefined
    }
  }

  get textDecoration(): 'underline' | undefined {
    if (this.u && this.u !== 'none') {
      return 'underline'
    }
    else {
      return undefined
    }
  }
}
