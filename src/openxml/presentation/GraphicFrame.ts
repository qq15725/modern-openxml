import type { Transform2D } from '../drawing'
import type { ExtensionList } from './ExtensionList'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.graphicframe
 */
@defineElement('p:graphicFrame')
export class GraphicFrame extends OXML {
  @defineChild('p:extLst') extLst?: ExtensionList
  @defineChild('a:graphic') graphic?: OXML
  @defineChild('p:nvGraphicFramePr') declare nvGraphicFramePr: OXML
  @defineChild('p:xfrm') declare xfrm: Transform2D
}
