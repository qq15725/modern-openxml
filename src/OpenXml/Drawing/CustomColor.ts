import { defineAttribute, defineElement } from '../../core'
import { _ColorStyle } from './_ColorStyle'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.customcolor
 */
@defineElement('a:custClr')
export class CustomColor extends _ColorStyle {
  @defineAttribute('name') declare name?: string
}
