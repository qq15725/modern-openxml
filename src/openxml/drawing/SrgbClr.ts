import type { Alpha } from './Alpha'
import { defineChild, defineElement, defineProperty, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.srgbclr
 */
@defineElement('srgbClr', 'a')
export class SrgbClr extends OXML {
  @defineProperty('val', 'string') declare val: string

  @defineChild('alpha') alpha?: Alpha
}
