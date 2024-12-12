import type { ApplicationNonVisualDrawingProperties } from './ApplicationNonVisualDrawingProperties'
import type { NonVisualDrawingProperties } from './NonVisualDrawingProperties'
import type { NonVisualGraphicFrameDrawingProperties } from './NonVisualGraphicFrameDrawingProperties'
import { defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.nonvisualgraphicframeproperties
 */
@defineElement('p:nvGraphicFramePr')
export class NonVisualGraphicFrameProperties extends OOXML {
  @defineChild('p:cNvGraphicFramePr') declare cNvGraphicFramePr?: NonVisualGraphicFrameDrawingProperties
  @defineChild('p:cNvPr') declare cNvPr?: NonVisualDrawingProperties
  @defineChild('p:nvPr') declare nvPr?: ApplicationNonVisualDrawingProperties
}
