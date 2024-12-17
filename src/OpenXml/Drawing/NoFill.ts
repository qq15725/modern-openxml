import type { FillContext, FillJSON } from './_FillList'
import { defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.nofill
 */
@defineElement('a:noFill')
export class NoFill extends OOXML {
  override toJSON(_ctx?: FillContext): FillJSON {
    return {}
  }
}
