import { defineChild, defineNode, XmlObject } from '../../core'
import { Background } from './Background'
import { ShapeTree } from './ShapeTree'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.commonslidedata
 */
@defineNode('cSld', 'p')
export class CommonSlideData extends XmlObject {
  @defineChild('p:bg', Background) declare bg: Background
  @defineChild('p:spTree', ShapeTree) declare spTree: ShapeTree
}
