import type { Point } from './Point'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.lineto
 */
@defineElement('a:lnTo')
export class LineTo extends OXML {
  @defineChild('a:pt') declare pt: Point
}
