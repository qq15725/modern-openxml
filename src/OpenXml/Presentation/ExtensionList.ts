import type { Extension } from './Extension'
import { defineChildren, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.extensionlist
 */
@defineElement('p:extLst')
export class ExtensionList extends OOXML {
  @defineChildren('p:ext') declare value: Extension[]
}
