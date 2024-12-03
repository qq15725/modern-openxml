import type { TextWrappingValues } from './TextWrappingValues'
import { defineElement, defineProperty, OXML } from '../../core'
import { TextAnchoringTypeValues } from './TextAnchoringTypeValues'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.bodyproperties
 */
@defineElement('bodyPr', 'a')
export class BodyProperties extends OXML {
  @defineProperty('anchor', TextAnchoringTypeValues) anchor?: TextAnchoringTypeValues
  @defineProperty('anchorCtr', 'boolean') anchorCtr?: boolean
  @defineProperty('spcFirstLastPara', 'boolean') spcFirstLastPara?: boolean
  @defineProperty('lIns', 'emu') lIns?: number
  @defineProperty('tIns', 'emu') tIns?: number
  @defineProperty('rIns', 'emu') rIns?: number
  @defineProperty('bIns', 'emu') bIns?: number
  @defineProperty('rot', 'degree') rot?: number
  @defineProperty('wrap', 'string') wrap?: TextWrappingValues
  @defineProperty('upright', 'boolean') upright?: boolean
}
