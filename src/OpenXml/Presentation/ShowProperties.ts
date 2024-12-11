import type { ExtensionList } from './ExtensionList'
import { defineAttribute, defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.showproperties
 */
@defineElement('p:showPr')
export class ShowProperties extends OOXML {
  @defineAttribute('loop', 'boolean') declare loop?: boolean
  @defineAttribute('showAnimation', 'boolean') declare showAnimation?: boolean
  @defineAttribute('showNarration', 'boolean') declare showNarration?: boolean
  @defineAttribute('useTimings', 'boolean') declare useTimings?: boolean

  @defineChild('p:browse') declare browse?: OOXML
  @defineChild('p:custShow') declare custShow?: OOXML
  @defineChild('p:extLst') declare extLst?: ExtensionList
  @defineChild('p:kiosk') declare kiosk?: OOXML
  @defineChild('p:penClr') declare penClr?: OOXML
  @defineChild('p:present') declare present?: OOXML
  @defineChild('p:sldAll') declare sldAll?: OOXML
  @defineChild('p:sldRg') declare sldRg?: OOXML
}
