import type { FillContext, FillJSON } from './_FillList'
import { defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.groupfill
 */
@defineElement('a:grpFill')
export class GroupFill extends OOXML {
  override toJSON(_ctx?: FillContext): FillJSON {
    return {
      // TODO
    }
  }
}
