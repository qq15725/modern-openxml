import type { FillRectangle } from './FillRectangle'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.stretch
 */
@defineElement('a:stretch')
export class Stretch extends OXML {
  @defineChild('a:fillRect') fillRect?: FillRectangle
}
