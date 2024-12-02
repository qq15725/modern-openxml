import { defineChild, defineNode, XmlObject } from '../../core'
import { ApplicationNonVisualDrawingProperties } from './ApplicationNonVisualDrawingProperties'
import { NonVisualDrawingProperties } from './NonVisualDrawingProperties'
import { NonVisualPictureDrawingProperties } from './NonVisualPictureDrawingProperties'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.nonvisualpictureproperties
 */
@defineNode('nvPicPr', 'p')
export class NonVisualPictureProperties extends XmlObject {
  @defineChild('p:cNvPr', NonVisualDrawingProperties) declare cNvPr: NonVisualDrawingProperties
  @defineChild('p:cNvPicPr', NonVisualPictureDrawingProperties) declare cNvPicPr: NonVisualPictureDrawingProperties
  @defineChild('p:nvPr', ApplicationNonVisualDrawingProperties) declare nvPr: ApplicationNonVisualDrawingProperties
}
