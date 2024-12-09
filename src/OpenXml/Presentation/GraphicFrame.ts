import type { Transform2D } from '../Drawing'
import type { ExtensionList } from './ExtensionList'
import { defineChild, defineElement, defineProperty, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.graphicframe
 */
@defineElement('p:graphicFrame')
export class GraphicFrame extends OXML {
  @defineChild('p:extLst') declare extLst?: ExtensionList
  @defineChild('a:graphic') declare graphic?: OXML
  @defineChild('p:nvGraphicFramePr') declare nvGraphicFramePr: OXML
  @defineChild('p:xfrm') declare xfrm: Transform2D

  @defineProperty() type = 'graphicFrame'
}
