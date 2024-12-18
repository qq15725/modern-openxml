import type { GeometryGetPathsOptions, GeometryPath } from './_Geometry'
import type { AdjustHandleList } from './AdjustHandleList'
import type { AdjustValueList } from './AdjustValueList'
import type { ConnectionSiteList } from './ConnectionSiteList'
import type { PathList } from './PathList'
import type { Rectangle } from './Rectangle'
import type { ShapeGuideList } from './ShapeGuideList'
import { defineAttribute, defineElement, OOXML } from '../../core'
import { _Geometry } from './_Geometry'
import _presetShapeDefinitionsRaw from './assets/presetShapeDefinitions.xml?raw'

interface _PresetGeometry {
  avLst?: AdjustValueList
  gdLst?: ShapeGuideList
  ahLst?: AdjustHandleList
  cxnLst?: ConnectionSiteList
  rect?: Rectangle
  pathLst?: PathList
}

let _presetShapeDefinitions: undefined | Record<string, _PresetGeometry>

function getPresetShapeDefinitions(): Record<string, _PresetGeometry> {
  if (!_presetShapeDefinitions) {
    _presetShapeDefinitions = Object.fromEntries(
      new OOXML(_presetShapeDefinitionsRaw)
        .getChildren()
        .map(el => [
          el.element.tagName,
          {
            avLst: el.getChild('avLst'),
            gdLst: el.getChild('gdLst'),
            ahLst: el.getChild('ahLst'),
            cxnLst: el.getChild('cxnLst'),
            rect: el.getChild('rect'),
            pathLst: el.getChild('pathLst'),
          },
        ]),
    ) as Record<string, _PresetGeometry>
  }
  return _presetShapeDefinitions!
}

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.presetgeometry
 */
@defineElement('a:prstGeom')
export class PresetGeometry extends _Geometry {
  @defineAttribute('prst') declare prst: string

  override getPaths(options: GeometryGetPathsOptions): GeometryPath[] {
    return super.getPaths({
      ...getPresetShapeDefinitions()[this.prst],
      avLst: this.avLst,
      ...options,
    })
  }
}
