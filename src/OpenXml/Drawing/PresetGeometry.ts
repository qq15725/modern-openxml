import type { GeometryContext, GeometryPath } from './_Geometry'
import type { PresetShapeDefinitions } from './PresetShapeDefinitions'
import { defineAttribute, defineElement } from '../../core'
import { _Geometry } from './_Geometry'

export interface PresetGeometryContext extends GeometryContext {
  presetShapeDefinitions?: PresetShapeDefinitions
}

export interface PresetGeometryJSON {
  preset: string
  paths: GeometryPath[]
}

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.presetgeometry
 */
@defineElement('a:prstGeom')
export class PresetGeometry extends _Geometry {
  @defineAttribute('prst') declare prst: string

  override getPaths(ctx: PresetGeometryContext): GeometryPath[] {
    return super.getPaths({
      ...ctx?.presetShapeDefinitions?.get(this.prst),
      avLst: this.avLst,
      ...ctx,
    })
  }

  override toJSON(ctx: PresetGeometryContext): PresetGeometryJSON {
    return {
      preset: this.prst,
      paths: this.getPaths(ctx),
    }
  }
}
