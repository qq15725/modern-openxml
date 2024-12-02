import { defineChild, defineNode, XmlObject } from '../../core'
import { FillRectangle } from './FillRectangle'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.stretch
 */
@defineNode('stretch', 'a')
export class Stretch extends XmlObject {
  @defineChild('a:fillRect', FillRectangle) fillRect?: FillRectangle
}
