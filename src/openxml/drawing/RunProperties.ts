import type { SolidFill } from './SolidFill'
import { defineAttribute, defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.runproperties
 */
@defineElement('a:rPr')
export class RunProperties extends OXML {
  @defineAttribute('altLang') altLang?: string
  @defineAttribute('baseline') baseline?: string
  @defineAttribute('b', 'boolean') b?: boolean
  @defineAttribute('bmk') bmk?: string
  @defineAttribute('cap') cap?: string
  @defineAttribute('dirty') dirty?: string
  @defineAttribute('sz', 'fontSize') sz?: number
  @defineAttribute('i', 'boolean') i?: boolean
  @defineAttribute('kern', 'emu') kern?: string
  @defineAttribute('kumimoji') kumimoji?: string
  @defineAttribute('lang') lang?: string
  @defineAttribute('noProof') noProof?: string
  @defineAttribute('normalizeH') normalizeH?: string
  @defineAttribute('Outline') Outline?: string
  @defineAttribute('smtClean') smtClean?: string
  @defineAttribute('smtId') smtId?: string
  @defineAttribute('spc', 'fontSize') spc?: number
  @defineAttribute('err') err?: string
  @defineAttribute('strike') strike?: string
  @defineAttribute('u') u?: string

  @defineChild('a:cs') cs?: OXML
  @defineChild('a:ea') ea?: OXML
  @defineChild('a:latin') latin?: OXML
  @defineChild('a:sym') sym?: OXML
  @defineChild('a:solidFill') solidFill?: SolidFill
}
