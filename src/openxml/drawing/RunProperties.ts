import type { SolidFill } from './SolidFill'
import { defineAttribute, defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.run
 */
@defineElement('rPr', 'a')
export class RunProperties extends OXML {
  @defineAttribute('b', 'boolean') b?: boolean
  @defineAttribute('i', 'boolean') i?: boolean
  @defineAttribute('u') u?: string
  @defineAttribute('kern', 'emu') kern?: string
  @defineAttribute('spc', 'fontsize') spc?: number
  @defineAttribute('sz', 'fontsize') sz?: number

  @defineChild('cs') cs?: OXML
  @defineChild('ea') ea?: OXML
  @defineChild('latin') latin?: OXML
  @defineChild('sym') sym?: OXML
  @defineChild('solidFill') solidFill?: SolidFill
}
