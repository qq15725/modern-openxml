import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.gradientfill
 */
@defineElement('gradFill', 'a')
export class GradientFill extends OXML {
  @defineChild('a:gsLst', OXML) gsLst?: OXML
  @defineChild('a:lin', OXML) lin?: OXML
  @defineChild('a:path', OXML) path?: OXML
  @defineChild('a:tileRect', OXML) tileRect?: OXML
}
