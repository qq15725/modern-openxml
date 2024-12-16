import type { SequenceTimeNode } from './SequenceTimeNode'
import { defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.childtimenodelist
 */
@defineElement('p:childTnLst')
export class ChildTimeNodeList extends OOXML {
  @defineChild('p:anim') declare anim?: OOXML
  @defineChild('p:animClr') declare animClr?: OOXML
  @defineChild('p:animEffect') declare animEffect?: OOXML
  @defineChild('p:animMotion') declare animMotion?: OOXML
  @defineChild('p:animRot') declare animRot?: OOXML
  @defineChild('p:animScale') declare animScale?: OOXML
  @defineChild('p:audio') declare audio?: OOXML
  @defineChild('p:cmd') declare cmd?: OOXML
  @defineChild('p:excl') declare excl?: OOXML
  @defineChild('p:par') declare par?: OOXML
  @defineChild('p:seq') declare seq?: SequenceTimeNode
  @defineChild('p:set') declare set?: OOXML
  @defineChild('p:video') declare video?: OOXML
}
