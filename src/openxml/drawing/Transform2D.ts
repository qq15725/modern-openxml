import { defineChild, defineNode, defineProperty, XmlObject } from '../../core'
import { Extents } from './Extents'
import { Offset } from './Offset'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.transform2d
 */
@defineNode('xfrm', 'a')
export class Transform2D extends XmlObject {
  @defineProperty('rot', 'degree') declare rot: number
  @defineProperty('flipV', 'boolean') declare flipV: boolean
  @defineProperty('flipH', 'boolean') declare flipH: boolean

  @defineChild('a:off', Offset) declare off: Offset
  @defineChild('a:ext', Extents) declare ext: Extents
  @defineChild('a:chOff', Offset) chOff?: Offset
  @defineChild('a:chExt', Extents) chExt?: Extents
}
