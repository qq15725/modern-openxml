import { defineChild, defineNode, XmlObject } from '../../core'
import { BackgroundProperties } from './BackgroundProperties'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.background
 */
@defineNode('bg', 'p')
export class Background extends XmlObject {
  @defineChild('p:bgPr', BackgroundProperties) declare bgPr: BackgroundProperties
}
