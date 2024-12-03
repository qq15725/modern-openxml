import type { BackgroundProperties } from './BackgroundProperties'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.background
 */
@defineElement('bg', 'p')
export class Background extends OXML {
  @defineChild('bgPr') declare bgPr: BackgroundProperties
}
