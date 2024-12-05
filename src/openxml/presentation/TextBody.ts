import type { BodyProperties, ListStyle, Paragraph } from '../drawing'
import { defineChild, defineChildren, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.textbody
 */
@defineElement('p:txBody')
export class TextBody extends OXML {
  @defineChild('a:bodyPr') declare bodyPr: BodyProperties
  @defineChild('a:lstStyle') declare lstStyle?: ListStyle
  @defineChildren('a:p') declare pList: Paragraph[]
}
