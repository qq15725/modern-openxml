import type { Alpha } from './Alpha'
import { defineAttribute, defineChild, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.systemcolor
 */
@defineElement('a:sysClr')
export class SystemColor extends OOXML {
  @defineAttribute('val') declare val: string

  @defineChild('a:alpha') declare alpha?: Alpha

  get color(): string {
    return this.val
  }
}
