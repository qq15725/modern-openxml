import { defineChild, defineProperty } from '../../core'
import { _Namespace } from './_Namespace'
import { Extents } from './Extents'
import { Offset } from './Offset'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.transform2d
 */
export class Transform2D extends _Namespace {
  readonly tag = 'xfrm'

  @defineProperty('rot', 'degree') declare rot: number
  @defineProperty('flipV', 'boolean') declare flipV: boolean
  @defineProperty('flipH', 'boolean') declare flipH: boolean

  @defineChild('a:off', Offset) declare off: Offset
  @defineChild('a:ext', Extents) declare ext: Extents
  @defineChild('a:chOff', Offset) declare chOff?: Offset
  @defineChild('a:chExt', Extents) declare chExt?: Extents
}
