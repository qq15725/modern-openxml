import type { Point } from './Point'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.moveto
 */
@defineElement('a:moveTo')
export class MoveTo extends OXML {
  @defineChild('a:pt') declare pt: Point
}
