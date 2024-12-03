import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.presetgeometry
 */
@defineElement('prstGeom', 'a')
export class PresetGeometry extends OXML {
  @defineAttribute('prst') declare prst: string
}
