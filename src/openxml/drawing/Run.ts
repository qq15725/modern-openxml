import { defineChild, defineNode, XmlObject } from '../../core'
import { RunProperties } from './RunProperties'
import { Text } from './Text'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.run
 */
@defineNode('r', 'a')
export class Run extends XmlObject {
  @defineChild('rPr', RunProperties) declare rPr: RunProperties
  @defineChild('t', Text) declare t: Text

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
  get textContent(): string { return this.t.node.textContent ?? '' }
}
