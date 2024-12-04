import type { Background } from './Background'
import type { ShapeTree } from './ShapeTree'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.commonslidedata
 */
@defineElement('p:cSld')
export class CommonSlideData extends OXML {
  @defineChild('p:bg') declare bg: Background
  @defineChild('p:spTree') declare spTree: ShapeTree
}
