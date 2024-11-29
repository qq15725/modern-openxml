import { defineChild } from '../../core'
import { _Namespace } from './_Namespace'
import { ApplicationNonVisualDrawingProperties } from './ApplicationNonVisualDrawingProperties'
import { NonVisualDrawingProperties } from './NonVisualDrawingProperties'
import { NonVisualShapeDrawingProperties } from './NonVisualShapeDrawingProperties'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.nonvisualshapeproperties
 */
export class NonVisualShapeProperties extends _Namespace {
  readonly tag = 'nvSpPr'

  @defineChild('p:cNvPr', NonVisualDrawingProperties) declare cNvPr: NonVisualDrawingProperties
  @defineChild('p:cNvSpPr', NonVisualShapeDrawingProperties) declare cNvSpPr: NonVisualShapeDrawingProperties
  @defineChild('p:nvPr', ApplicationNonVisualDrawingProperties) declare nvPr: ApplicationNonVisualDrawingProperties
}
