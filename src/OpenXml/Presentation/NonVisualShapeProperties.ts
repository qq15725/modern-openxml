import type { ApplicationNonVisualDrawingProperties } from './ApplicationNonVisualDrawingProperties'
import type { NonVisualDrawingProperties } from './NonVisualDrawingProperties'
import type { NonVisualShapeDrawingProperties } from './NonVisualShapeDrawingProperties'
import { defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.nonvisualshapeproperties
 */
@defineElement('p:nvSpPr')
export class NonVisualShapeProperties extends OOXML {
  @defineChild('p:cNvPr') declare cNvPr: NonVisualDrawingProperties
  @defineChild('p:cNvSpPr') declare cNvSpPr: NonVisualShapeDrawingProperties
  @defineChild('p:nvPr') declare nvPr: ApplicationNonVisualDrawingProperties
}
