import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slidesize
 */
@defineElement('sldSz', 'p')
export class SlideSize extends OXML {
  @defineAttribute('cx', 'emu') declare cx: number
  @defineAttribute('cy', 'emu') declare cy: number
}
