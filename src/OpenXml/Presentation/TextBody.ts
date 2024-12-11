import type { BodyProperties, ListStyle, Paragraph } from '../Drawing'
import { defineChild, defineChildren, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.textbody
 */
@defineElement('p:txBody')
export class TextBody extends OOXML {
  @defineChild('a:bodyPr') declare bodyPr: BodyProperties
  @defineChild('a:lstStyle') declare lstStyle?: ListStyle
  @defineChildren('a:p') declare pList: Paragraph[]
}
