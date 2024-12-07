import type { ExtensionList } from './ExtensionList'
import { defineAttribute, defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.showproperties
 */
@defineElement('p:showPr')
export class ShowProperties extends OXML {
  @defineAttribute('loop', 'boolean') declare loop?: boolean
  @defineAttribute('showAnimation', 'boolean') declare showAnimation?: boolean
  @defineAttribute('showNarration', 'boolean') declare showNarration?: boolean
  @defineAttribute('useTimings', 'boolean') declare useTimings?: boolean

  @defineChild('p:browse') declare browse?: OXML
  @defineChild('p:custShow') declare custShow?: OXML
  @defineChild('p:extLst') declare extLst?: ExtensionList
  @defineChild('p:kiosk') declare kiosk?: OXML
  @defineChild('p:penClr') declare penClr?: OXML
  @defineChild('p:present') declare present?: OXML
  @defineChild('p:sldAll') declare sldAll?: OXML
  @defineChild('p:sldRg') declare sldRg?: OXML
}
