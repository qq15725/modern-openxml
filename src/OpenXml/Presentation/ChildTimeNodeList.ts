import type { Animate } from './Animate'
import type { AnimateColor } from './AnimateColor'
import type { AnimateEffect } from './AnimateEffect'
import type { SequenceTimeNode } from './SequenceTimeNode'
import { defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.childtimenodelist
 */
@defineElement('p:childTnLst')
export class ChildTimeNodeList extends OOXML {
  @defineChild('p:anim') declare anim?: Animate
  @defineChild('p:animClr') declare animClr?: AnimateColor
  @defineChild('p:animEffect') declare animEffect?: AnimateEffect
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
