import type { ApplicationNonVisualDrawingProperties } from './ApplicationNonVisualDrawingProperties'
import type { NonVisualDrawingProperties } from './NonVisualDrawingProperties'
import type { NonVisualShapeDrawingProperties } from './NonVisualShapeDrawingProperties'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.nonvisualshapeproperties
 */
@defineElement('nvSpPr', 'p')
export class NonVisualShapeProperties extends OXML {
  @defineChild('cNvPr') declare cNvPr: NonVisualDrawingProperties
  @defineChild('cNvSpPr') declare cNvSpPr: NonVisualShapeDrawingProperties
  @defineChild('nvPr') declare nvPr: ApplicationNonVisualDrawingProperties
}
