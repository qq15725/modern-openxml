import { defineElement, defineProperty, OXML } from '../../core'
import { TextAlignmentTypeValues } from './TextAlignmentTypeValues'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.paragraphproperties
 */
@defineElement('pPr', 'a')
export class ParagraphProperties extends OXML {
  @defineProperty('lvl', 'number') lvl?: number
  @defineProperty('marL', 'emu') marL?: number
  @defineProperty('marR', 'emu') marR?: number
  @defineProperty('indent', 'emu') indent?: number
  @defineProperty('algn', TextAlignmentTypeValues) algn?: TextAlignmentTypeValues
  @defineProperty('fontAlgn', 'string') fontAlgn?: string
  @defineProperty('rtl', 'string') rtl?: string
}
