import type { ExtensionList } from './ExtensionList'
import type { GradientFill } from './GradientFill'
import type { Miter } from './Miter'
import type { NoFill } from './NoFill'
import type { PatternFill } from './PatternFill'
import type { SolidFill } from './SolidFill'
import { defineAttribute, defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.outline
 */
@defineElement('a:ln')
export class Outline extends OOXML {
  @defineAttribute('algn', 'ST_PenAlignment') declare algn: string
  @defineAttribute('cap', 'ST_LineCap') declare cap: string
  @defineAttribute('cmpd', 'ST_CompoundLine') declare cmpd: string
  @defineAttribute('w', 'ST_LineWidth') declare w: number

  @defineChild('a:bevel') declare bevel: OOXML
  @defineChild('a:custDash') declare custDash: OOXML
  @defineChild('a:extLst') declare extLst: ExtensionList
  @defineChild('a:gradFill') declare gradFill: GradientFill
  @defineChild('a:headEnd') declare headEnd: OOXML
  @defineChild('a:miter') declare miter: Miter
  @defineChild('a:noFill') declare noFill: NoFill
  @defineChild('a:pattFill') declare pattFill: PatternFill
  @defineChild('a:prstDash') declare prstDash: OOXML
  @defineChild('a:round') declare round: OOXML
  @defineChild('a:solidFill') declare solidFill: SolidFill
  @defineChild('a:tailEnd') declare tailEnd: OOXML

  // <a:solidFill>
  //  <a:srgbClr val="transparent">
  //   <a:alpha val="100000"/>
  //  </a:srgbClr>
  // </a:solidFill>
  // <a:prstDash val="solid" />
  // <a:headEnd type="none" />
  // <a:tailEnd type="none" />
  //
}
