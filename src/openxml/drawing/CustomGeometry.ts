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
  @defineChild('a:ahLst') declare ahLst?: AdjustHandleList
  @defineChild('a:avLst') declare avLst?: AdjustValueList
  @defineChild('a:cxnLst') declare cxnLst?: ConnectionSiteList
  @defineChild('a:gdLst') declare gdLst?: ShapeGuideList
  @defineChild('a:pathLst') declare pathLst?: PathList
  @defineChild('a:rect') declare rect?: Rectangle

  toSVGString(): string {
    // TODO
    return ''
  }
}
