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

  @defineProperty() style = new _RunStyle(this)
  @defineProperty('_content') declare content: string

  protected get _content(): string { return this.t.element.textContent ?? '' }
}

export class _RunStyle extends OXML {
  @defineProperty('_color') declare color?: string
  @defineProperty('_fontWeight') declare fontWeight?: 700
  @defineProperty('_fontStyle') declare fontStyle?: 'italic'
  @defineProperty('_fontFamily') declare fontFamily?: string
  @defineProperty('_textTransform') declare textTransform?: 'uppercase' | 'lowercase'
  @defineProperty('_textDecoration') declare textDecoration?: 'underline'
  @defineProperty('_parent.rPr.sz') declare fontSize?: number
  @defineProperty('_parent.rPr.spc') declare letterSpacing?: number

  protected get _color(): string | undefined {
    return this._parent.rPr.fillColor
  }

  protected get _fontFamily(): string | undefined {
    const rPr = this._parent.rPr
    return rPr.cs?.typeface
      ?? rPr.ea?.typeface
      ?? rPr.latin?.typeface
      ?? rPr.sym?.typeface
  }

  protected get _fontWeight(): 700 | undefined {
    switch (this._parent.rPr.b) {
      case true:
        return 700
      default:
        return undefined
    }
  }

  protected get _fontStyle(): 'italic' | undefined {
    switch (this._parent.rPr.i) {
      case true:
        return 'italic'
      default:
        return undefined
    }
  }

  protected get _textTransform(): 'uppercase' | 'lowercase' | undefined {
    switch (this._parent.rPr.cap) {
      case 'all':
        return 'uppercase'
      case 'small':
        return 'lowercase'
      case 'none':
      default:
        return undefined
    }
  }

  protected get _textDecoration(): 'underline' | undefined {
    if (this._parent.rPr.u && this._parent.rPr.u !== 'none') {
      return 'underline'
    }
    else {
      return undefined
    }
  }

  constructor(
    protected _parent: Run,
  ) {
    super()
  }
}
