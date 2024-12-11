import type { Extension } from './Extension'
import { defineChildren, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.extensionlist
 */
@defineElement('a:extLst')
export class ExtensionList extends OOXML {
  @defineChildren('a:ext') declare children: Extension[]
}
