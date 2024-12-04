import type { RunProperties } from './RunProperties'
import type { Text } from './Text'
import { defineChild, defineElement, defineProperty, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.run
 */
@defineElement('a:r')
export class Run extends OXML {
  @defineChild('a:rPr') declare rPr: RunProperties
  @defineChild('a:t') declare t: Text

  @defineProperty('rPr.b', false) declare bold: boolean
  @defineProperty('rPr.i', false) declare italic: boolean
  @defineProperty('rPr.u', false) declare underline: boolean
  @defineProperty('rPr.sz', 0) declare fontSize: number
  @defineProperty('rPr.spc', 0) declare letterSpacing: number

  get color(): string | undefined { return this.rPr.solidFill?.srgbClr.val }
  get textIndent(): string | undefined { return this.rPr.kern }
  get fontComplexScript(): string | undefined { return this.rPr.cs?.typeface }
  get fontEastasian(): string | undefined { return this.rPr.ea?.typeface }
  get fontLatin(): string | undefined { return this.rPr.latin?.typeface }
  get fontSymbol(): string | undefined { return this.rPr.sym?.typeface }
  get textContent(): string { return this.t.element.textContent ?? '' }
}
