import type { ChildExtents } from './ChildExtents'
import type { ChildOffset } from './ChildOffset'
import type { Extents } from './Extents'
import type { Offset } from './Offset'
import { defineAttribute, defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.transform2d
 */
@defineElement('xfrm', 'a')
export class Transform2D extends OXML {
  @defineAttribute('rot', 'degree') declare rot: number
  @defineAttribute('flipV', 'boolean') declare flipV: boolean
  @defineAttribute('flipH', 'boolean') declare flipH: boolean

  @defineChild('off') declare off: Offset
  @defineChild('ext') declare ext: Extents
  @defineChild('chOff') chOff?: ChildOffset
  @defineChild('chExt') chExt?: ChildExtents
}
