import type { CommonTimeNode } from './CommonTimeNode'
import { defineAttribute, defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.sequencetimenode
 */
@defineElement('p:seq')
export class SequenceTimeNode extends OOXML {
  @defineAttribute('concurrent') declare concurrent?: any
  @defineAttribute('nextAc') declare nextAc?: any
  @defineAttribute('prevAc') declare prevAc?: any

  @defineChild('p:cTn') declare cTn?: CommonTimeNode
  @defineChild('p:nextCondLst') declare nextCondLst?: OOXML
  @defineChild('p:prevCondLst') declare prevCondLst?: OOXML
}
