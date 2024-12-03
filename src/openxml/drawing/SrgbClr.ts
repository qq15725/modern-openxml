import type { Alpha } from './Alpha'
import { defineAttribute, defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.srgbclr
 */
@defineElement('srgbClr', 'a')
export class SrgbClr extends OXML {
  @defineAttribute('val') declare val: string

  @defineChild('alpha') alpha?: Alpha
}
