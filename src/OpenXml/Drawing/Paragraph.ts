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

  override get children(): (Break | Run | EndParagraphRunProperties)[] {
    return super.children.filter((child) => {
      switch (child.tag) {
        case 'fld':
        case 'pPr':
          return false
        case 'br':
        case 'r':
        case 'endParaRPr':
        default:
          return true
      }
    }) as any
  }
}
