import { defineElement, OOXML } from '../../core'

export interface GroupFillJSON {
  type: 'groupFill'
}

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.groupfill
 */
@defineElement('a:grpFill')
export class GroupFill extends OOXML {
  override toJSON(): GroupFillJSON {
    return {
      type: 'groupFill',
    }
  }
}
