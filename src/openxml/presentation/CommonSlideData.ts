import { defineChild } from '../../core'
import { _Namespace } from './_Namespace'
import { Background } from './Background'
import { ShapeTree } from './ShapeTree'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.commonslidedata
 */
export class CommonSlideData extends _Namespace {
  readonly tag = 'cSld'

  @defineChild('p:bg', Background) declare bg: Background
  @defineChild('p:spTree', ShapeTree) declare spTree: ShapeTree
}
