import { defineElement, defineProperty, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.presetgeometry
 */
@defineElement('prstGeom', 'a')
export class PresetGeometry extends OXML {
  @defineProperty('prst', 'string') declare prst: string
}
