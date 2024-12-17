import type { RunProperties } from './RunProperties'
import type { Text } from './Text'
import { defineChild, defineElement, defineProperty, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.run
 */
@defineElement('a:r')
export class Run extends OOXML {
  @defineChild('a:rPr') declare rPr: RunProperties
  @defineChild('a:t') declare t: Text
  @defineProperty('_content') declare content: string

  protected get _content(): string { return this.t.element.textContent ?? '' }
}
