import type { OOXML } from '../../core'
import type { Transform2D } from '../Drawing'
import type { ExtensionList } from './ExtensionList'
import type { NonVisualGraphicFrameProperties } from './NonVisualGraphicFrameProperties'
import { defineChild, defineElement, defineProperty } from '../../core'
import { _Element } from './_Element'
import { _GraphicFrameComputedStyle } from './_GraphicFrameComputedStyle'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.graphicframe
 */
@defineElement('p:graphicFrame')
export class GraphicFrame extends _Element {
  @defineChild('p:extLst') declare extLst?: ExtensionList
  @defineChild('a:graphic') declare graphic?: OOXML
  @defineChild('p:nvGraphicFramePr') declare nvGraphicFramePr: NonVisualGraphicFrameProperties
  @defineChild('p:xfrm') declare xfrm: Transform2D

  @defineProperty() type = 'graphicFrame'
  @defineProperty('nvGraphicFramePr.cNvPr.name') declare name?: string
  @defineProperty() computedStyle = new _GraphicFrameComputedStyle(this)
}
