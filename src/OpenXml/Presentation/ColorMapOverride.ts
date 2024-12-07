import type { MasterColorMapping } from '../Drawing'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.colormapoverride
 */
@defineElement('p:clrMapOvr')
export class ColorMapOverride extends OXML {
  @defineChild('a:masterClrMapping') declare masterClrMapping: MasterColorMapping
}
