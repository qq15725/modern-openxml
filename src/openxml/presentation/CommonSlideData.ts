import type { Background } from './Background'
import type { ShapeTree } from './ShapeTree'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.commonslidedata
 */
@defineElement('cSld', 'p')
export class CommonSlideData extends OXML {
  @defineChild('bg') declare bg: Background
  @defineChild('spTree') declare spTree: ShapeTree
}
