import type { Break } from './Break'
import type { EndParagraphRunProperties } from './EndParagraphRunProperties'
import type { Field } from './Field'
import type { ParagraphProperties } from './ParagraphProperties'
import type { Run } from './Run'
import { defineChild, defineElement, defineProperty, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.paragraph
 */
@defineElement('a:p')
export class Paragraph extends OOXML {
  @defineChild('a:fld') declare fld?: Field
  @defineChild('a:pPr') declare pPr?: ParagraphProperties

  @defineProperty('pPr.lvl') declare level?: number
  @defineProperty('pPr.fontAlgn') declare fontAlign?: string
  @defineProperty('_children') declare children: (Break | Run | EndParagraphRunProperties)[]

  get _children(): (Break | Run | EndParagraphRunProperties)[] {
    return Array.from(this.element.children).map((element) => {
      switch (element.tagName) {
        case 'a:fld':
        case 'a:pPr':
          return undefined
        case 'a:br':
        case 'a:r':
        case 'a:endParaRPr':
        default:
          return OOXML.make(element)
      }
    }).filter(Boolean) as any
  }
}
