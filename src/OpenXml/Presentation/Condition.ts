import type { TargetElement } from './TargetElement'
import { defineAttribute, defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.condition
 */
@defineElement('p:cond')
export class Condition extends OOXML {
  @defineAttribute('delay', 'ST_TLTime') declare delay?: string
  @defineAttribute('evt', 'ST_TLTriggerEvent') declare evn?: string

  @defineChild('p:rtn') declare rtn?: OOXML
  @defineChild('p:tgtEl') declare tgtEl?: TargetElement
  @defineChild('p:tn') declare tn?: OOXML
}
