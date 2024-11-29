import { defineChild } from '../../core'
import { _Namespace } from './_Namespace'
import { ApplicationNonVisualDrawingProperties } from './ApplicationNonVisualDrawingProperties'
import { NonVisualDrawingProperties } from './NonVisualDrawingProperties'
import { NonVisualPictureDrawingProperties } from './NonVisualPictureDrawingProperties'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.nonvisualpictureproperties
 */
export class NonVisualPictureProperties extends _Namespace {
  readonly tag = 'nvPicPr'

  @defineChild('p:cNvPr', NonVisualDrawingProperties) declare cNvPr: NonVisualDrawingProperties
  @defineChild('p:cNvPicPr', NonVisualPictureDrawingProperties) declare cNvPicPr: NonVisualPictureDrawingProperties
  @defineChild('p:nvPr', ApplicationNonVisualDrawingProperties) declare nvPr: ApplicationNonVisualDrawingProperties
}
