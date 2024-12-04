import type { ApplicationNonVisualDrawingProperties } from './ApplicationNonVisualDrawingProperties'
import type { NonVisualDrawingProperties } from './NonVisualDrawingProperties'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.nonvisualgroupshapeproperties
 */
@defineElement('p:nvGrpSpPr')
export class NonVisualGroupShapeProperties extends OXML {
  @defineChild('p:cNvPr') declare cNvPr: NonVisualDrawingProperties
  @defineChild('p:cNvGrpSpPr') declare cNvGrpSpPr: OXML
  @defineChild('p:nvPr') declare nvPr: ApplicationNonVisualDrawingProperties
}
