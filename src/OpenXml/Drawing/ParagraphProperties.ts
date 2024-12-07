import { defineElement } from '../../core'
import { _ParagraphProperties } from './_ParagraphProperties'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.paragraphproperties
 */
@defineElement('a:pPr')
export class ParagraphProperties extends _ParagraphProperties {
  //
}
