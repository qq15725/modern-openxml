import type { BuildList } from './BuildList'
import type { ExtensionList } from './ExtensionList'
import type { TimeNodeList } from './TimeNodeList'
import { defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.timing
 */
@defineElement('p:timing')
export class Timing extends OOXML {
  @defineChild('p:bldLst') declare bldLst?: BuildList
  @defineChild('p:extLst') declare extLst?: ExtensionList
  @defineChild('p:tnLst') declare tnLst?: TimeNodeList
}
