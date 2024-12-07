import type { SpacingPercent } from './SpacingPercent'
import type { SpacingPoints } from './SpacingPoints'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.linespacing
 */
@defineElement('a:lnSpc')
export class LineSpacing extends OXML {
  @defineChild('a:spcPct') declare spcPct?: SpacingPercent
  @defineChild('a:spcPts') declare spcPts?: SpacingPoints
}
