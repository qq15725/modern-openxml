import type { SolidFill } from './SolidFill'
import { defineAttribute, defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.runproperties
 */
@defineElement('a:rPr')
export class RunProperties extends OXML {
  @defineAttribute('altLang') declare altLang?: string
  @defineAttribute('baseline') declare baseline?: string
  @defineAttribute('b', 'boolean') declare b?: boolean
  @defineAttribute('bmk') declare bmk?: string
  @defineAttribute('cap') declare cap?: string
  @defineAttribute('dirty') declare dirty?: string
  @defineAttribute('sz', 'fontSize') declare sz?: number
  @defineAttribute('i', 'boolean') declare i?: boolean
  @defineAttribute('kern', 'emu') declare kern?: string
  @defineAttribute('kumimoji') declare kumimoji?: string
  @defineAttribute('lang') declare lang?: string
  @defineAttribute('noProof') declare noProof?: string
  @defineAttribute('normalizeH') declare normalizeH?: string
  @defineAttribute('Outline') declare Outline?: string
  @defineAttribute('smtClean') declare smtClean?: string
  @defineAttribute('smtId') declare smtId?: string
  @defineAttribute('spc', 'fontSize') declare spc?: number
  @defineAttribute('err') declare err?: string
  @defineAttribute('strike') declare strike?: string
  @defineAttribute('u') declare u?: string

  @defineChild('a:cs') declare cs?: OXML
  @defineChild('a:ea') declare ea?: OXML
  @defineChild('a:latin') declare latin?: OXML
  @defineChild('a:sym') declare sym?: OXML
  @defineChild('a:solidFill') declare solidFill?: SolidFill
}
