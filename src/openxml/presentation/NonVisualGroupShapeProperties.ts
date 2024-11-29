import { defineChild } from '../../core'
import { _Namespace } from './_Namespace'
import { ApplicationNonVisualDrawingProperties } from './ApplicationNonVisualDrawingProperties'
import { NonVisualDrawingProperties } from './NonVisualDrawingProperties'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.nonvisualgroupshapeproperties
 */
export class NonVisualGroupShapeProperties extends _Namespace {
  readonly tag = 'nvGrpSpPr'

  @defineChild('p:cNvPr', NonVisualDrawingProperties) declare cNvPr: NonVisualDrawingProperties
  @defineChild('p:cNvGrpSpPr', _Namespace) declare cNvGrpSpPr: _Namespace
  @defineChild('p:nvPr', ApplicationNonVisualDrawingProperties) declare nvPr: ApplicationNonVisualDrawingProperties
}
