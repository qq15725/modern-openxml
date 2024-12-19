import type { AdjustHandleList } from './AdjustHandleList'
import type { AdjustValueList } from './AdjustValueList'
import type { ConnectionSiteList } from './ConnectionSiteList'
import type { PathList } from './PathList'
import type { Rectangle } from './Rectangle'
import type { ShapeGuideList } from './ShapeGuideList'
import { OOXML } from '../../core'

export interface PresetGeometryDefinition {
  avLst?: AdjustValueList
  gdLst?: ShapeGuideList
  ahLst?: AdjustHandleList
  cxnLst?: ConnectionSiteList
  rect?: Rectangle
  pathLst?: PathList
}

export class PresetShapeDefinitions extends OOXML {
  get(type: string): PresetGeometryDefinition | undefined {
    const dom = this.element.querySelector(type)
    if (!dom)
      return
    const node = OOXML.make(dom)
    if (!node)
      return
    return {
      avLst: node.getChild('avLst'),
      gdLst: node.getChild('gdLst'),
      ahLst: node.getChild('ahLst'),
      cxnLst: node.getChild('cxnLst'),
      rect: node.getChild('rect'),
      pathLst: node.getChild('pathLst'),
    }
  }
}
