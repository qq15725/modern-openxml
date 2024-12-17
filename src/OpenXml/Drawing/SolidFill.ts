import { defineElement } from '../../core'
import { _ColorStyle } from './_ColorStyle'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.solidfill
 */
@defineElement('a:solidFill')
export class SolidFill extends _ColorStyle {

}
