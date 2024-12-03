import type { Extents } from './Extents'
import type { Offset } from './Offset'
import { defineChild, defineElement, defineProperty, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.transform2d
 */
@defineElement('xfrm', 'a')
export class Transform2D extends OXML {
  @defineProperty('rot', 'degree') declare rot: number
  @defineProperty('flipV', 'boolean') declare flipV: boolean
  @defineProperty('flipH', 'boolean') declare flipH: boolean

  @defineChild('off') declare off: Offset
  @defineChild('ext') declare ext: Extents
  @defineChild('chOff') chOff?: Offset
  @defineChild('chExt') chExt?: Extents
}
