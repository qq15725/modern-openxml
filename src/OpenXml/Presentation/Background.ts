import type { BackgroundProperties } from './BackgroundProperties'
import { defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.background
 */
@defineElement('p:bg')
export class Background extends OOXML {
  @defineChild('p:bgPr') declare bgPr: BackgroundProperties
}
