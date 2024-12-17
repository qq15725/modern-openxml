import type { OOXML } from '../../core'
import type { CustomGeometry } from './CustomGeometry'
import type { EffectDag } from './EffectDag'
import type { EffectList } from './EffectList'
import type { ExtensionList } from './ExtensionList'
import type { Outline } from './Outline'
import type { PresetGeometry } from './PresetGeometry'
import type { Transform2D } from './Transform2D'
import { defineChild, defineElement } from '../../core'
import { _FillStyle } from './_FillStyle'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.shapeproperties
 */
@defineElement('a:spPr')
export class ShapeProperties extends _FillStyle {
  @defineChild('a:extLst') declare extLst?: ExtensionList
  @defineChild('a:effectDag') declare effectDag?: EffectDag
  @defineChild('a:effectLst') declare effectLst?: EffectList
  @defineChild('a:xfrm') declare xfrm?: Transform2D
  @defineChild('a:prstGeom') declare prstGeom?: PresetGeometry
  @defineChild('a:custGeom') declare custGeom?: CustomGeometry
  @defineChild('a:ln') declare ln?: Outline
  @defineChild('a:scene3d') declare scene3d?: OOXML
  @defineChild('a:sp3d') declare sp3d?: OOXML
}
