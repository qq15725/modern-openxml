import type { IDOCFillProp } from 'modern-idoc'
import type { BackgroundColor } from './BackgroundColor'
import type { ForegroundColor } from './ForegroundColor'
import { defineAttribute, defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.patternfill
 */
@defineElement('a:pattFill')
export class PatternFill extends OOXML {
  @defineAttribute('prst', 'presetPatternVal') declare prst?: string

  @defineChild('a:bgClr') declare bgClr?: BackgroundColor
  @defineChild('a:fgClr') declare fgClr?: ForegroundColor

  override toIDOC(): IDOCFillProp {
    return 'none'
  }
}
