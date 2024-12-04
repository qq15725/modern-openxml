import type { BackgroundProperties } from './BackgroundProperties'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.background
 */
@defineElement('p:bg')
export class Background extends OXML {
  @defineChild('p:bgPr') declare bgPr: BackgroundProperties
}
