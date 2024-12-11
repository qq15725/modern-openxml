import type { Point } from './Point'
import { defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.moveto
 */
@defineElement('a:moveTo')
export class MoveTo extends OOXML {
  @defineChild('a:pt') declare pt: Point
}
