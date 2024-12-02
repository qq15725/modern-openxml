import { defineNode, defineProperty, XmlObject } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.presetgeometry
 */
@defineNode('prstGeom', 'a')
export class PresetGeometry extends XmlObject {
  @defineProperty('prst', 'string') declare prst: string
}
