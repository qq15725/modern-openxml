import type { MasterColorMapping } from '../drawing'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.colormapoverride
 */
@defineElement('clrMapOvr', 'p')
export class ColorMapOverride extends OXML {
  @defineChild('masterClrMapping') declare masterClrMapping: MasterColorMapping
}
