import type { ExtensionList } from './ExtensionList'
import type { NonVisualConnectionShapeProperties } from './NonVisualConnectionShapeProperties'
import type { ShapeProperties } from './ShapeProperties'
import type { ShapeStyle } from './ShapeStyle'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.connectionshape
 */
@defineElement('p:cxnSp')
export class ConnectionShape extends OXML {
  @defineChild('p:extLst') declare extLst?: ExtensionList
  @defineChild('p:nvCxnSpPr') declare nvCxnSpPr: NonVisualConnectionShapeProperties
  @defineChild('p:spPr') declare spPr: ShapeProperties
  @defineChild('p:style') declare style?: ShapeStyle
}
