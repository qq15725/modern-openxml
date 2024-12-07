import { defineAttribute, defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.presetgeometry
 */
@defineElement('a:prstGeom')
export class PresetGeometry extends OXML {
  @defineAttribute('prst') declare prst: string

  @defineChild('a:avLst') declare avLst?: OXML
}
