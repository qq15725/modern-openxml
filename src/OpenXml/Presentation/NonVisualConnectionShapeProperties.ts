import type { ApplicationNonVisualDrawingProperties } from './ApplicationNonVisualDrawingProperties'
import type { NonVisualDrawingProperties } from './NonVisualDrawingProperties'
import { defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.nonvisualconnectionshapeproperties
 */
@defineElement('p:nvCxnSpPr')
export class NonVisualConnectionShapeProperties extends OOXML {
  @defineChild('p:cNvCxnSpPr') declare cNvCxnSpPr: OOXML
  @defineChild('p:cNvPr') declare cNvPr: NonVisualDrawingProperties
  @defineChild('p:nvPr') declare nvPr: ApplicationNonVisualDrawingProperties
}
