import type { Extension } from './Extension'
import { defineChildren, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.extensionlist
 */
@defineElement('p:extLst')
export class ExtensionList extends OXML {
  @defineChildren('p:ext') declare value: Extension[]
}
