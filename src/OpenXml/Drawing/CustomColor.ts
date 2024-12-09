import { defineAttribute, defineElement } from '../../core'
import { _Color } from './_Color'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.customcolor
 */
@defineElement('a:custClr')
export class CustomColor extends _Color {
  @defineAttribute('name') declare name?: string
}
