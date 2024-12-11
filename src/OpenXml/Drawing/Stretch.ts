import type { FillRectangle } from './FillRectangle'
import { defineChild, defineElement, OOXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.stretch
 */
@defineElement('a:stretch')
export class Stretch extends OOXML {
  @defineChild('a:fillRect') declare fillRect?: FillRectangle
}
