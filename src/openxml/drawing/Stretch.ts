import type { FillRectangle } from './FillRectangle'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.stretch
 */
@defineElement('stretch', 'a')
export class Stretch extends OXML {
  @defineChild('fillRect') fillRect?: FillRectangle
}
