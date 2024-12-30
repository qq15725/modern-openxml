import type { IDOCFillProp } from 'modern-idoc'
import { defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.groupfill
 */
@defineElement('a:grpFill')
export class GroupFill extends OOXML {
  override toIDOC(): IDOCFillProp {
    // TODO
    return 'none'
  }
}
