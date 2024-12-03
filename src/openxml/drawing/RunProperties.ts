import type { SolidFill } from './SolidFill'
import { defineChild, defineElement, defineProperty, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.run
 */
@defineElement('rPr', 'a')
export class RunProperties extends OXML {
  @defineProperty('b', 'boolean') b?: boolean
  @defineProperty('i', 'boolean') i?: boolean
  @defineProperty('u', 'string') u?: string
  @defineProperty('kern', 'emu') kern?: string
  @defineProperty('spc', 'fontsize') spc?: number
  @defineProperty('sz', 'fontsize') sz?: number

  @defineChild('cs') cs?: OXML
  @defineChild('ea') ea?: OXML
  @defineChild('latin') latin?: OXML
  @defineChild('sym') sym?: OXML
  @defineChild('solidFill') solidFill?: SolidFill
}
