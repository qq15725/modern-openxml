import { defineProperty } from '../../core'
import { _Namespace } from './_Namespace'
import { TextAlignmentTypeValues } from './TextAlignmentTypeValues'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.paragraphproperties
 */
export class ParagraphProperties extends _Namespace {
  readonly tag = 'pPr'

  @defineProperty('lvl', 'number') lvl?: number
  @defineProperty('marL', 'emu') marL?: number
  @defineProperty('marR', 'emu') marR?: number
  @defineProperty('indent', 'emu') indent?: number
  @defineProperty('algn', TextAlignmentTypeValues) algn?: TextAlignmentTypeValues
  @defineProperty('fontAlgn', 'string') fontAlgn?: string
  @defineProperty('rtl', 'string') rtl?: string
}
