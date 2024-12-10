import type { Break } from './Break'
import type { EndParagraphRunProperties } from './EndParagraphRunProperties'
import type { Field } from './Field'
import type { ParagraphProperties } from './ParagraphProperties'
import type { Run } from './Run'
import { defineChild, defineElement, defineProperty, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.paragraph
 */
@defineElement('a:p')
export class Paragraph extends OXML {
  @defineChild('a:fld') declare fld?: Field
  @defineChild('a:pPr') declare pPr?: ParagraphProperties

  @defineProperty() style = new _ParagraphStyle(this)
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
          return OXML.make(element)
      }
    }).filter(Boolean) as any
  }
}

export class _ParagraphStyle extends OXML {
  @defineProperty('_parent.pPr.marL') declare marginLeft?: number
  @defineProperty('_parent.pPr.marR') declare marginRight?: number
  @defineProperty('_parent.pPr.indent') declare textIndent: number
  @defineProperty('_parent.pPr.lnSpc.spcPct.val') declare lineHeight?: number
  @defineProperty('_textAlign') declare textAlign?: 'center' | 'start' | 'end'

  get rightToLeft(): boolean | undefined { return this._parent.pPr?.rtl }

  protected get _textAlign(): 'center' | 'start' | 'end' | undefined {
    switch (this._parent.pPr?.algn) {
      case 'dist':
      case 'just':
      case 'justLow':
      case 'l':
      case 'thaiDist':
        return 'start'
      case 'ctr':
        return 'center'
      case 'r':
        return 'end'
      default:
        return undefined
    }
  }

  constructor(
    protected _parent: Paragraph,
  ) {
    super()
  }
}
