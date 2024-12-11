import type { MasterColorMapping } from '../Drawing'
import { defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.colormapoverride
 */
@defineElement('p:clrMapOvr')
export class ColorMapOverride extends OOXML {
  @defineChild('a:masterClrMapping') declare masterClrMapping: MasterColorMapping
}
