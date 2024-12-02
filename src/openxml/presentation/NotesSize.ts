import { defineProperty } from '../../core'
import { _Namespace } from './_Namespace'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.notessize
 */
export class NotesSize extends _Namespace {
  readonly tag = 'notesSz'

  @defineProperty('cx', 'emu') declare cx: number
  @defineProperty('cy', 'emu') declare cy: number
}
