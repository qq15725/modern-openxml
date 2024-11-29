import { defineChild } from '../../core'
import { BodyProperties, ListStyle, Paragraph } from '../drawing'
import { _Namespace } from './_Namespace'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.textbody
 */
export class TextBody extends _Namespace {
  readonly tag = 'txBody'

  @defineChild('a:bodyPr', BodyProperties) declare bodyPr: BodyProperties
  @defineChild('a:lstStyle', ListStyle) lstStyle?: ListStyle
  @defineChild('a:p', Paragraph) declare pList: Paragraph[]
}
