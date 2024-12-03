import { defineElement, defineProperty, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.notessize
 */
@defineElement('notesSz', 'p')
export class NotesSize extends OXML {
  @defineProperty('cx', 'emu') declare cx: number
  @defineProperty('cy', 'emu') declare cy: number
}
