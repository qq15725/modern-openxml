import type { Extension } from './Extension'
import { defineChildren, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.extensionlist
 */
@defineElement('a:extLst')
export class ExtensionList extends OXML {
  @defineChildren('a:ext') declare children: Extension[]
}
