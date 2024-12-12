import type { ExtensionList } from './ExtensionList'
import type { NonVisualConnectionShapeProperties } from './NonVisualConnectionShapeProperties'
import type { ShapeProperties } from './ShapeProperties'
import type { ShapeStyle } from './ShapeStyle'
import { defineChild, defineElement, defineProperty } from '../../core'
import { _Element } from './_Element'
import { _ShapeStyle } from './Shape'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.connectionshape
 */
@defineElement('p:cxnSp')
export class ConnectionShape extends _Element {
  @defineChild('p:extLst') declare extLst?: ExtensionList
  @defineChild('p:nvCxnSpPr') declare nvCxnSpPr: NonVisualConnectionShapeProperties
  @defineChild('p:spPr') declare spPr: ShapeProperties
  @defineChild('p:style') declare pStyle?: ShapeStyle

  @defineProperty() type = 'connectionShape'
  @defineProperty('nvCxnSpPr.cNvPr.name') declare name?: string
  @defineProperty() style = new _ShapeStyle(this as any)
}
