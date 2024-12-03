import type { ApplicationNonVisualDrawingProperties } from './ApplicationNonVisualDrawingProperties'
import type { NonVisualDrawingProperties } from './NonVisualDrawingProperties'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.nonvisualgroupshapeproperties
 */
@defineElement('nvGrpSpPr', 'p')
export class NonVisualGroupShapeProperties extends OXML {
  @defineChild('cNvPr') declare cNvPr: NonVisualDrawingProperties
  @defineChild('cNvGrpSpPr') declare cNvGrpSpPr: OXML
  @defineChild('nvPr') declare nvPr: ApplicationNonVisualDrawingProperties
}
