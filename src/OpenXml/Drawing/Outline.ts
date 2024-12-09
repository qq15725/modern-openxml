import type { ExtensionList } from './ExtensionList'
import type { GradientFill } from './GradientFill'
import type { NoFill } from './NoFill'
import type { PatternFill } from './PatternFill'
import type { SolidFill } from './SolidFill'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.outline
 */
@defineElement('a:ln')
export class Outline extends OXML {
  @defineChild('a:bevel') declare bevel: OXML
  @defineChild('a:custDash') declare custDash: OXML
  @defineChild('a:extLst') declare extLst: ExtensionList
  @defineChild('a:gradFill') declare gradFill: GradientFill
  @defineChild('a:headEnd') declare headEnd: OXML
  @defineChild('a:miter') declare miter: OXML
  @defineChild('a:noFill') declare noFill: NoFill
  @defineChild('a:pattFill') declare pattFill: PatternFill
  @defineChild('a:prstDash') declare prstDash: OXML
  @defineChild('a:round') declare round: OXML
  @defineChild('a:solidFill') declare solidFill: SolidFill
  @defineChild('a:tailEnd') declare tailEnd: OXML

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
