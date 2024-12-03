import type { BodyProperties, ListStyle, Paragraph } from '../drawing'
import { defineChild, defineChildren, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.textbody
 */
@defineElement('txBody', 'p')
export class TextBody extends OXML {
  @defineChild('bodyPr') declare bodyPr: BodyProperties
  @defineChild('lstStyle') lstStyle?: ListStyle
  @defineChildren('p') declare pList: Paragraph[]
}
