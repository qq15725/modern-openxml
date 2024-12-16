import type { CommonTimeNode } from './CommonTimeNode'
import { defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.paralleltimenode
 */
@defineElement('p:par')
export class ParallelTimeNode extends OOXML {
  @defineChild('p:cTn') declare cTn?: CommonTimeNode
}
