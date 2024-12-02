import { defineChild, defineNode, XmlObject } from '../../core'
import { MasterColorMapping } from '../drawing'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.colormapoverride
 */
@defineNode('clrMapOvr', 'p')
export class ColorMapOverride extends XmlObject {
  @defineChild('a:masterClrMapping', MasterColorMapping) declare masterClrMapping: MasterColorMapping
}
