import type { IDOCGeometryDeclaration } from 'modern-idoc'
import type { GeometryContext, GeometryPath } from './_Geometry'
import type { PresetShapeDefinitions } from './PresetShapeDefinitions'
import { pathCommandsToPathData } from 'modern-path2d'
import { defineAttribute, defineElement } from '../../core'
import { _Geometry } from './_Geometry'

export interface PresetGeometryContext extends GeometryContext {
  presetShapeDefinitions?: PresetShapeDefinitions
}

export interface IDOCPresetGeometry extends IDOCGeometryDeclaration {
  preset: string
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

  override toIDOC(ctx: PresetGeometryContext): IDOCPresetGeometry {
    return {
      preset: this.prst,
      data: this.getPaths(ctx).map((path) => {
        const { commands, ...props } = path
        return {
          ...props,
          data: pathCommandsToPathData(commands),
        }
      }),
    }
  }
}
