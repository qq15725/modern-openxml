import { defineAttribute, defineElement, OXML } from '../../core'
import { TextAlignmentTypeValues } from './TextAlignmentTypeValues'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.paragraphproperties
 */
@defineElement('a:pPr')
export class ParagraphProperties extends OXML {
  @defineAttribute('lvl', 'number') declare lvl?: number
  @defineAttribute('marL', 'emu') declare marL?: number
  @defineAttribute('marR', 'emu') declare marR?: number
  @defineAttribute('indent', 'emu') declare indent?: number
  @defineAttribute('algn', TextAlignmentTypeValues) declare algn?: TextAlignmentTypeValues
  @defineAttribute('fontAlgn') declare fontAlgn?: string
  @defineAttribute('rtl') declare rtl?: string
}
