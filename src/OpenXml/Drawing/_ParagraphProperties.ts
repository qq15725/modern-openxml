import type { TextAlignmentTypeValues, TextFontAlignmentValues } from './_types'
import type { DefaultRunProperties } from './DefaultRunProperties'
import type { ExtensionList } from './ExtensionList'
import type { LineSpacing } from './LineSpacing'
import { defineAttribute, defineChild, OOXML } from '../../core'

export abstract class _ParagraphProperties extends OOXML {
  @defineAttribute('algn') declare algn?: TextAlignmentTypeValues
  @defineAttribute('defTabSz', 'emu') declare defTabSz?: number
  @defineAttribute('eaLnBrk', 'boolean') declare eaLnBrk?: boolean
  @defineAttribute('fontAlgn') declare fontAlgn?: TextFontAlignmentValues
  @defineAttribute('hangingPunct', 'boolean') declare hangingPunct?: boolean
  @defineAttribute('indent', 'emu') declare indent?: number
  @defineAttribute('latinLnBrk', 'boolean') declare latinLnBrk?: boolean
  @defineAttribute('marL', 'emu') declare marL?: number
  @defineAttribute('lvl', 'number') declare lvl?: number
  @defineAttribute('marR', 'emu') declare marR?: number
  @defineAttribute('rtl', 'boolean') declare rtl?: boolean

  @defineChild('a:buAutoNum') declare buAutoNum?: OOXML
  @defineChild('a:buBlip') declare buBlip?: OOXML
  @defineChild('a:buChar') declare buChar?: OOXML
  @defineChild('a:buClr') declare buClr?: OOXML
  @defineChild('a:buClrTx') declare buClrTx?: OOXML
  @defineChild('a:buFont') declare buFont?: OOXML
  @defineChild('a:buFontTx') declare buFontTx?: OOXML
  @defineChild('a:buNone') declare buNone?: OOXML
  @defineChild('a:buSzPct') declare buSzPct?: OOXML
  @defineChild('a:buSzPts') declare buSzPts?: OOXML
  @defineChild('a:buSzTx') declare buSzTx?: OOXML
  @defineChild('a:defRPr') declare defRPr?: DefaultRunProperties
  @defineChild('a:extLst') declare extLst?: ExtensionList
  @defineChild('a:lnSpc') declare lnSpc?: LineSpacing
  @defineChild('a:spcAft') declare spcAft?: OOXML
  @defineChild('a:spcBef') declare spcBef?: OOXML
  @defineChild('a:tabLst') declare tabLst?: OOXML

  get textAlign(): 'left' | 'right' | 'center' | 'justify' | undefined {
    switch (this.algn) {
      case 'l':
        return 'left'
      case 'r':
        return 'right'
      case 'ctr':
        return 'center'
      case 'dist':
      case 'thaiDist':
      case 'just':
      case 'justLow':
        return 'justify'
      default:
        return undefined
    }
  }
}
