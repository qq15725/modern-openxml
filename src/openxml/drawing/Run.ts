import type { RunProperties } from './RunProperties'
import type { Text } from './Text'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.run
 */
@defineElement('r', 'a')
export class Run extends OXML {
  @defineChild('rPr') declare rPr: RunProperties
  @defineChild('t') declare t: Text

  get color(): string | undefined { return this.rPr.solidFill?.srgbClr.val }
  get bold(): boolean | undefined { return this.rPr.b }
  get italic(): boolean | undefined { return this.rPr.i }
  get underline(): string | undefined { return this.rPr.u }
  get textIndent(): string | undefined { return this.rPr.kern }
  get letterSpacing(): number | undefined { return this.rPr.spc }
  get fontSize(): number | undefined { return this.rPr.sz }
  get fontComplexScript(): string | undefined { return this.rPr.cs?.typeface }
  get fontEastasian(): string | undefined { return this.rPr.ea?.typeface }
  get fontLatin(): string | undefined { return this.rPr.latin?.typeface }
  get fontSymbol(): string | undefined { return this.rPr.sym?.typeface }
  get textContent(): string { return this.t.element.textContent ?? '' }
}
