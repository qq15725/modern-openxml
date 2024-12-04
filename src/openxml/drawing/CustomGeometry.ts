import type { AdjustHandleList } from './AdjustHandleList'
import type { AdjustValueList } from './AdjustValueList'
import type { ConnectionSiteList } from './ConnectionSiteList'
import type { PathList } from './PathList'
import type { Rectangle } from './Rectangle'
import type { ShapeGuideList } from './ShapeGuideList'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.customgeometry
 */
@defineElement('a:custGeom')
export class CustomGeometry extends OXML {
  @defineChild('a:ahLst') ahLst?: AdjustHandleList
  @defineChild('a:avLst') avLst?: AdjustValueList
  @defineChild('a:cxnLst') cxnLst?: ConnectionSiteList
  @defineChild('a:gdLst') gdLst?: ShapeGuideList
  @defineChild('a:pathLst') pathLst?: PathList
  @defineChild('a:rect') rect?: Rectangle
}
