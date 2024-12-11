import type { ApplicationNonVisualDrawingProperties } from './ApplicationNonVisualDrawingProperties'
import type { NonVisualDrawingProperties } from './NonVisualDrawingProperties'
import { defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.nonvisualgroupshapeproperties
 */
@defineElement('p:nvGrpSpPr')
export class NonVisualGroupShapeProperties extends OOXML {
  @defineChild('p:cNvPr') declare cNvPr: NonVisualDrawingProperties
  @defineChild('p:cNvGrpSpPr') declare cNvGrpSpPr: OOXML
  @defineChild('p:nvPr') declare nvPr: ApplicationNonVisualDrawingProperties
}
