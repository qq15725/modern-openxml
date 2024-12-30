import type { IDOCFillProp } from 'modern-idoc'
import { defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.nofill
 */
@defineElement('a:noFill')
export class NoFill extends OOXML {
  override toIDOC(): IDOCFillProp {
    return 'none'
  }
}
