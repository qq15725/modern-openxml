import type { ApplicationNonVisualDrawingProperties } from './ApplicationNonVisualDrawingProperties'
import type { NonVisualDrawingProperties } from './NonVisualDrawingProperties'
import type { NonVisualPictureDrawingProperties } from './NonVisualPictureDrawingProperties'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.nonvisualpictureproperties
 */
@defineElement('p:nvPicPr')
export class NonVisualPictureProperties extends OXML {
  @defineChild('p:cNvPr') declare cNvPr: NonVisualDrawingProperties
  @defineChild('p:cNvPicPr') declare cNvPicPr: NonVisualPictureDrawingProperties
  @defineChild('p:nvPr') declare nvPr: ApplicationNonVisualDrawingProperties
}
