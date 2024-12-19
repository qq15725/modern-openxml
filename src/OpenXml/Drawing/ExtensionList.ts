import type { Extension } from './Extension'
import { defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.extensionlist
 */
@defineElement('a:extLst')
export class ExtensionList extends OOXML {
  override get children(): Extension[] {
    return super.children.filter(child => child.tag === 'ext') as any[]
  }
}
