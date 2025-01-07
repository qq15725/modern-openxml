import type { IDOCGeometryDeclaration } from 'modern-idoc'
import type { GeometryContext, GeometryPath } from './_Geometry'
import type { AdjustHandleList } from './AdjustHandleList'
import type { ConnectionSiteList } from './ConnectionSiteList'
import type { PathList } from './PathList'
import type { Rectangle } from './Rectangle'
import type { ShapeGuideList } from './ShapeGuideList'
import { svgPathCommandsToData } from 'modern-path2d'
import { defineChild, defineElement } from '../../core'
import { _Geometry } from './_Geometry'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.customgeometry
 */
@defineElement('a:custGeom')
export class CustomGeometry extends _Geometry {
  @defineChild('a:ahLst') declare ahLst?: AdjustHandleList
  @defineChild('a:cxnLst') declare cxnLst?: ConnectionSiteList
  @defineChild('a:gdLst') declare gdLst?: ShapeGuideList
  @defineChild('a:pathLst') declare pathLst?: PathList
  @defineChild('a:rect') declare rect?: Rectangle

  override getPaths(ctx: GeometryContext): GeometryPath[] {
    return super.getPaths({
      avLst: this.avLst,
      gdLst: this.gdLst,
      pathLst: this.pathLst,
      ...ctx,
    })
  }

  override toIDOC(ctx: GeometryContext): IDOCGeometryDeclaration {
    return {
      data: this.getPaths(ctx).map((path) => {
        const { commands, ...props } = path
        return {
          ...props,
          data: svgPathCommandsToData(commands),
        }
      }),
    }
  }
}
