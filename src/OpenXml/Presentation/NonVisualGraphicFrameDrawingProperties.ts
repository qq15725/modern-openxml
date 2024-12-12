import { defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.nonvisualgraphicframedrawingproperties
 */
@defineElement('p:cNvGraphicFramePr')
export class NonVisualGraphicFrameDrawingProperties extends OOXML {
  @defineChild('p:extLst') declare extLst?: OOXML
  @defineChild('p:graphicFrameLocks') declare graphicFrameLocks?: OOXML
}
