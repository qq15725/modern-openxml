import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.notessize
 */
@defineElement('p:notesSz')
export class NotesSize extends OXML {
  @defineAttribute('cx', 'emu') declare cx: number
  @defineAttribute('cy', 'emu') declare cy: number
}
