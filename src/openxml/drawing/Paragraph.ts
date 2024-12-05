import type { TextAlignmentTypeValues } from './TextAlignmentTypeValues'
import { defineChild, defineElement, defineProperty, OXML } from '../../core'
import { ParagraphProperties } from './ParagraphProperties'
import { Run } from './Run'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.paragraph
 */
@defineElement('a:p')
export class Paragraph extends OXML {
  @defineChild('p:pPr', ParagraphProperties) declare pPr: ParagraphProperties
  @defineChild('p:r', Run) declare rList: Run[]

  @defineProperty('pPr.marL', 0) declare marginLeft: number
  @defineProperty('pPr.marR', 0) declare marginRight: number
  @defineProperty('pPr.indent', 0) declare textIndent: number
  @defineProperty('pPr.lvl') declare level?: number
  @defineProperty('pPr.fontAlgn') declare fontAlign?: string

  get textAlign(): TextAlignmentTypeValues | undefined { return this.pPr.algn }
  get rightToLeft(): string | undefined { return this.pPr.rtl }
}
