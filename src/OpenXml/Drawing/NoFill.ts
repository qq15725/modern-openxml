import { defineElement, OOXML } from '../../core'

export interface NoFillJSON {
  type: 'noFill'
}

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.nofill
 */
@defineElement('a:noFill')
export class NoFill extends OOXML {
  override toJSON(): NoFillJSON {
    return {
      type: 'noFill',
    }
  }
}
