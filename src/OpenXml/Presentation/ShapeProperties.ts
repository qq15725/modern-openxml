import type { OOXML } from '../../core'
import type {
  CustomGeometry,
  Outline,
  PresetGeometry,
  Transform2D,
} from '../Drawing'
import { defineChild, defineElement } from '../../core'
import { _Properties } from './_Properties'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.shapeproperties
 */
@defineElement('p:spPr')
export class ShapeProperties extends _Properties {
  @defineChild('a:scene3d') declare scene3d?: OOXML
  @defineChild('a:xfrm') declare xfrm?: Transform2D
  @defineChild('a:prstGeom') declare prstGeom?: PresetGeometry
  @defineChild('a:custGeom') declare custGeom?: CustomGeometry
  @defineChild('a:ln') declare ln?: Outline
  @defineChild('a:sp3d') declare sp3d?: OOXML
}
