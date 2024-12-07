import type { BackgroundColor } from './BackgroundColor'
import type { ForegroundColor } from './ForegroundColor'
import { defineAttribute, defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.patternfill
 */
@defineElement('a:pattFill')
export class PatternFill extends OXML {
  @defineAttribute('prst', 'presetPatternVal') declare prst?: string

  @defineChild('a:bgClr') declare bgClr?: BackgroundColor
  @defineChild('a:fgClr') declare fgClr?: ForegroundColor
}
