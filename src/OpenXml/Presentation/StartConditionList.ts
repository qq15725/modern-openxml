import type { Condition } from './Condition'
import { defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.startconditionlist
 */
@defineElement('p:stCondLst')
export class StartConditionList extends OOXML {
  @defineChild('p:cond') declare cond?: Condition
}
