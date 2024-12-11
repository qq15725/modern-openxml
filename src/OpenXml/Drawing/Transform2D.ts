import type { ChildExtents } from './ChildExtents'
import type { ChildOffset } from './ChildOffset'
import type { Extents } from './Extents'
import type { Offset } from './Offset'
import { defineAttribute, defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.transform2d
 */
@defineElement('a:xfrm')
export class Transform2D extends OOXML {
  @defineAttribute('rot', 'ST_Angle') declare rot: number
  @defineAttribute('flipV', 'boolean') declare flipV: boolean
  @defineAttribute('flipH', 'boolean') declare flipH: boolean

  @defineChild('a:off') declare off: Offset
  @defineChild('a:ext') declare ext: Extents
  @defineChild('a:chOff') declare chOff?: ChildOffset
  @defineChild('a:chExt') declare chExt?: ChildExtents
}
