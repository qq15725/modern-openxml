import type { Transform2D } from '../Drawing'
import type { ExtensionList } from './ExtensionList'
import { defineChild, defineElement, defineProperty, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.graphicframe
 */
@defineElement('p:graphicFrame')
export class GraphicFrame extends OOXML {
  @defineChild('p:extLst') declare extLst?: ExtensionList
  @defineChild('a:graphic') declare graphic?: OOXML
  @defineChild('p:nvGraphicFramePr') declare nvGraphicFramePr: OOXML
  @defineChild('p:xfrm') declare xfrm: Transform2D

  @defineProperty() type = 'graphicFrame'
}
