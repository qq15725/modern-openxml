import { defineAttribute, defineElement, OXML } from '../../core'
import { TextAlignmentTypeValues } from './TextAlignmentTypeValues'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.paragraphproperties
 */
@defineElement('a:pPr')
export class ParagraphProperties extends OXML {
  @defineAttribute('lvl', 'number') lvl?: number
  @defineAttribute('marL', 'emu') marL?: number
  @defineAttribute('marR', 'emu') marR?: number
  @defineAttribute('indent', 'emu') indent?: number
  @defineAttribute('algn', TextAlignmentTypeValues) algn?: TextAlignmentTypeValues
  @defineAttribute('fontAlgn') fontAlgn?: string
  @defineAttribute('rtl') rtl?: string
}
