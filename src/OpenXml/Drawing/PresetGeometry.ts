import type { GeometryGetPathsOptions, GeometryPath } from './_Geometry'
import type { PresetShapeDefinitions } from './PresetShapeDefinitions'
import { defineAttribute, defineElement } from '../../core'
import { _Geometry } from './_Geometry'
/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.presetgeometry
 */
@defineElement('a:prstGeom')
export class PresetGeometry extends _Geometry {
  @defineAttribute('prst') declare prst: string

  override getPaths(
    options: GeometryGetPathsOptions & {
      presetShapeDefinitions?: PresetShapeDefinitions
    },
  ): GeometryPath[] {
    return super.getPaths({
      ...options?.presetShapeDefinitions?.get(this.prst),
      avLst: this.avLst,
      ...options,
    })
  }
}
