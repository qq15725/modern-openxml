import type { TextWrappingValues } from './TextWrappingValues'
import { defineAttribute, defineElement, OXML } from '../../core'
import { TextAnchoringTypeValues } from './TextAnchoringTypeValues'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.bodyproperties
 */
@defineElement('a:bodyPr')
export class BodyProperties extends OXML {
  @defineAttribute('anchor', TextAnchoringTypeValues) anchor?: TextAnchoringTypeValues
  @defineAttribute('anchorCtr', 'boolean') anchorCtr?: boolean
  @defineAttribute('spcFirstLastPara', 'boolean') spcFirstLastPara?: boolean
  @defineAttribute('lIns', 'emu') lIns?: number
  @defineAttribute('tIns', 'emu') tIns?: number
  @defineAttribute('rIns', 'emu') rIns?: number
  @defineAttribute('bIns', 'emu') bIns?: number
  @defineAttribute('rot', 'degree') rot?: number
  @defineAttribute('wrap') wrap?: TextWrappingValues
  @defineAttribute('upright', 'boolean') upright?: boolean
}
