import type { Path } from './Path'
import { defineChildren, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.pathlist
 */
@defineElement('a:pathLst')
export class PathList extends OOXML {
  @defineChildren('a:path') declare value: Path[]
}
