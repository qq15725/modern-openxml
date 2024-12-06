import { defineElement } from '../../core'
import { _Font } from './_Font'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.latinfont
 */
@defineElement('a:latin')
export class LatinFont extends _Font {
  //
}
