import type { Background } from './Background'
import type { ShapeTree } from './ShapeTree'
import { defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.commonslidedata
 */
@defineElement('p:cSld')
export class CommonSlideData extends OOXML {
  @defineChild('p:bg') declare bg?: Background
  @defineChild('p:spTree') declare spTree: ShapeTree
}
