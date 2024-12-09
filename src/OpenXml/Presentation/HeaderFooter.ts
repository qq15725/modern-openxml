import type { ExtensionList } from './ExtensionList'
import { defineAttribute, defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.headerfooter
 */
@defineElement('p:hf')
export class HeaderFooter extends OXML {
  @defineAttribute('dt', 'boolean') declare dt?: boolean
  @defineAttribute('ftr', 'boolean') declare ftr?: boolean
  @defineAttribute('hdr', 'boolean') declare hdr?: boolean
  @defineAttribute('sldNum', 'boolean') declare sldNum?: boolean

  @defineChild('extLst') declare extLst?: ExtensionList
}
