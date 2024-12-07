import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.outline
 */
@defineElement('a:ln')
export class Outline extends OXML {
  @defineChild('a:bevel') declare bevel: OXML
  @defineChild('a:custDash') declare custDash: OXML
  @defineChild('a:extLst') declare extLst: OXML
  @defineChild('a:gradFill') declare gradFill: OXML
  @defineChild('a:headEnd') declare headEnd: OXML
  @defineChild('a:miter') declare miter: OXML
  @defineChild('a:noFill') declare noFill: OXML
  @defineChild('a:pattFill') declare pattFill: OXML
  @defineChild('a:prstDash') declare prstDash: OXML
  @defineChild('a:round') declare round: OXML
  @defineChild('a:solidFill') declare solidFill: OXML
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
