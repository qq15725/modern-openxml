import type { Alignment } from '../utils'
import { defineChild } from '../../core'
import { _Namespace } from './_Namespace'
import { ParagraphProperties } from './ParagraphProperties'
import { Run } from './Run'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.paragraph
 */
export class Paragraph extends _Namespace {
  readonly tag = 'p'

  @defineChild('pPr', ParagraphProperties) declare pPr: ParagraphProperties
  @defineChild('r', Run) declare rList: Run[]

  get level(): number | undefined { return this.pPr.lvl }
  get marginLeft(): number { return this.pPr.marL ?? 0 }
  get marginRight(): number { return this.pPr.marR ?? 0 }
  get textIndent(): number | undefined { return this.pPr.indent }
  get textAlign(): Alignment | undefined { return this.pPr.algn }
  get fontAlign(): string | undefined { return this.pPr.fontAlgn }
  get rightToLeft(): string | undefined { return this.pPr.rtl }
}
