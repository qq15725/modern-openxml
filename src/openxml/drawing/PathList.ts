import type { Path } from './Path'
import { defineChildren, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.pathlist
 */
@defineElement('a:pathLst')
export class PathList extends OXML {
  @defineChildren('a:path') declare value: Path[]
}
