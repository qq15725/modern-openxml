import type { TextWrappingValues } from './TextWrappingValues'
import { defineAttribute, defineElement, OXML } from '../../core'
import { TextAnchoringTypeValues } from './TextAnchoringTypeValues'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.bodyproperties
 */
@defineElement('a:bodyPr')
export class BodyProperties extends OXML {
  @defineAttribute('anchor', TextAnchoringTypeValues) declare anchor?: TextAnchoringTypeValues
  @defineAttribute('anchorCtr', 'boolean') declare anchorCtr?: boolean
  @defineAttribute('spcFirstLastPara', 'boolean') declare spcFirstLastPara?: boolean
  @defineAttribute('lIns', 'emu') declare lIns?: number
  @defineAttribute('tIns', 'emu') declare tIns?: number
  @defineAttribute('rIns', 'emu') declare rIns?: number
  @defineAttribute('bIns', 'emu') declare bIns?: number
  @defineAttribute('rot', 'degree') declare rot?: number
  @defineAttribute('wrap') declare wrap?: TextWrappingValues
  @defineAttribute('upright', 'boolean') declare upright?: boolean
}
