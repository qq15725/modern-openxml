import type { TextAlignmentTypeValues, TextFontAlignmentValues } from './_types'
import type { LineSpacing } from './LineSpacing'
import { defineAttribute, defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.paragraphproperties
 */
@defineElement('a:pPr')
export class ParagraphProperties extends OXML {
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

  @defineChild('a:buAutoNum') declare buAutoNum?: OXML
  @defineChild('a:buBlip') declare buBlip?: OXML
  @defineChild('a:buChar') declare buChar?: OXML
  @defineChild('a:buClr') declare buClr?: OXML
  @defineChild('a:buClrTx') declare buClrTx?: OXML
  @defineChild('a:buFont') declare buFont?: OXML
  @defineChild('a:buFontTx') declare buFontTx?: OXML
  @defineChild('a:buNone') declare buNone?: OXML
  @defineChild('a:buSzPct') declare buSzPct?: OXML
  @defineChild('a:buSzPts') declare buSzPts?: OXML
  @defineChild('a:buSzTx') declare buSzTx?: OXML
  @defineChild('a:defRPr') declare defRPr?: OXML
  @defineChild('a:extLst') declare extLst?: OXML
  @defineChild('a:lnSpc') declare lnSpc?: LineSpacing
  @defineChild('a:spcAft') declare spcAft?: OXML
  @defineChild('a:spcBef') declare spcBef?: OXML
  @defineChild('a:tabLst') declare tabLst?: OXML
}
