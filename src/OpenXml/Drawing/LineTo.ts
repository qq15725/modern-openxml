import type { Point } from './Point'
import { defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.lineto
 */
@defineElement('a:lnTo')
export class LineTo extends OOXML {
  @defineChild('a:pt') declare pt: Point
}
