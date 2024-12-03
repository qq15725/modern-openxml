import type { ApplicationNonVisualDrawingProperties } from './ApplicationNonVisualDrawingProperties'
import type { NonVisualDrawingProperties } from './NonVisualDrawingProperties'
import type { NonVisualPictureDrawingProperties } from './NonVisualPictureDrawingProperties'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.nonvisualpictureproperties
 */
@defineElement('nvPicPr', 'p')
export class NonVisualPictureProperties extends OXML {
  @defineChild('cNvPr') declare cNvPr: NonVisualDrawingProperties
  @defineChild('cNvPicPr') declare cNvPicPr: NonVisualPictureDrawingProperties
  @defineChild('nvPr') declare nvPr: ApplicationNonVisualDrawingProperties
}
