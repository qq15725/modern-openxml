import type { OOXML } from '../../core'
import type { ExtensionList } from './ExtensionList'
import type { Miter } from './Miter'
import type { PresetDash } from './PresetDash'
import { defineAttribute, defineChild, defineElement } from '../../core'
import { _FillStyle } from './_FillStyle'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.outline
 */
@defineElement('a:ln')
export class Outline extends _FillStyle {
  @defineAttribute('algn', 'ST_PenAlignment') declare algn?: string
  @defineAttribute('cap', 'ST_LineCap') declare cap?: string
  @defineAttribute('cmpd', 'ST_CompoundLine') declare cmpd?: string
  @defineAttribute('w', 'ST_LineWidth') declare w?: number

  @defineChild('a:bevel') declare bevel?: OOXML
  @defineChild('a:custDash') declare custDash?: OOXML
  @defineChild('a:extLst') declare extLst?: ExtensionList
  @defineChild('a:headEnd') declare headEnd?: OOXML
  @defineChild('a:miter') declare miter?: Miter
  @defineChild('a:prstDash') declare prstDash?: PresetDash
  @defineChild('a:round') declare round?: OOXML
  @defineChild('a:tailEnd') declare tailEnd?: OOXML
}
