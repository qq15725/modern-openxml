import { defineAttribute, defineElement, defineProperty, OOXML } from '../../core'

export interface IDOCSourceRectangle {
  bottom?: number
  left?: number
  top?: number
  right?: number
}

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.sourcerectangle
 */
@defineElement('a:srcRect')
export class SourceRectangle extends OOXML {
  @defineAttribute('b', 'ST_Percentage') declare b?: number
  @defineAttribute('l', 'ST_Percentage') declare l?: number
  @defineAttribute('t', 'ST_Percentage') declare t?: number
  @defineAttribute('r', 'ST_Percentage') declare r?: number

  @defineProperty('b') declare bottom?: number
  @defineProperty('l') declare left?: number
  @defineProperty('t') declare top?: number
  @defineProperty('r') declare right?: number

  override toIDOC(): IDOCSourceRectangle {
    return super.toIDOC()
  }
}
