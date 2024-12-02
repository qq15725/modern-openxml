import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.patternfill
 */
@defineElement('pattFill', 'a')
export class PatternFill extends OXML {
  @defineChild('a:bgClr', OXML) bgClr?: OXML
  @defineChild('a:fgClr', OXML) fgClr?: OXML
}
