import type { GeometryPath, Paragraph } from '../Drawing'
import type { NonVisualShapeProperties } from './NonVisualShapeProperties'
import type { PlaceholderShape } from './PlaceholderShape'
import type { ShapeProperties } from './ShapeProperties'
import type { ShapeStyle } from './ShapeStyle'
import type { TextBody } from './TextBody'
import { defineChild, defineElement, defineProperty } from '../../core'
import { _Element } from './_Element'
import { _ShapeComputedStyle } from './_ShapeComputedStyle'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.shape
 */
@defineElement('p:sp')
export class Shape extends _Element {
  @defineChild('p:nvSpPr') declare nvSpPr?: NonVisualShapeProperties
  @defineChild('p:spPr') declare spPr: ShapeProperties
  @defineChild('p:txBody') declare txBody: TextBody
  @defineChild('p:style') declare style?: ShapeStyle

  @defineProperty() type = 'shape'
  @defineProperty('nvSpPr.cNvPr.name') declare name?: string
  @defineProperty() computedStyle = new _ShapeComputedStyle(this)
  @defineProperty('nvSpPr.nvPr.ph') declare placeholder?: PlaceholderShape
  @defineProperty('_paragraphs') declare paragraphs?: Paragraph[]
  @defineProperty('_geometry') declare geometry?: GeometryPath[]

  get _geometry(): GeometryPath[] | undefined {
    const { custGeom, prstGeom: _prstGeom } = this.spPr
    // TODO prstGeom
    return custGeom?.getPaths(
      this.computedStyle.width ?? 0,
      this.computedStyle.height ?? 0,
      custGeom?.pathLst,
      custGeom?.avLst,
      custGeom?.gdLst,
    )
  }

  get _paragraphs(): Paragraph[] | undefined {
    if (this.nvSpPr?.cNvSpPr.txBox) {
      return this.txBody.pList
    }
    return undefined
  }
}
