import type { Condition } from './Condition'
import { defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.endconditionlist
 */
@defineElement('p:endCondLst')
export class EndConditionList extends OOXML {
  @defineChild('p:cond') declare cond?: Condition
}
