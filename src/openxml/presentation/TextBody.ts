import { defineChild, defineNode, XmlObject } from '../../core'
import { BodyProperties, ListStyle, Paragraph } from '../drawing'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.textbody
 */
@defineNode('txBody', 'p')
export class TextBody extends XmlObject {
  @defineChild('a:bodyPr', BodyProperties) declare bodyPr: BodyProperties
  @defineChild('a:lstStyle', ListStyle) lstStyle?: ListStyle
  @defineChild('a:p', Paragraph) declare pList: Paragraph[]
}
