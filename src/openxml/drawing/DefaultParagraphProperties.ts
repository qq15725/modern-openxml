import { defineElement } from '../../core'
import { _ParagraphProperties } from './_ParagraphProperties'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.DefaultParagraphProperties
 */
@defineElement('a:defPPr')
export class DefaultParagraphProperties extends _ParagraphProperties {
  //
}
