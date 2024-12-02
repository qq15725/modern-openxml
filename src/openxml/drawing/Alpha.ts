import { defineNode, defineProperty, XmlObject } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.alpha
 */
@defineNode('alpha', 'a')
export class Alpha extends XmlObject {
  @defineProperty('val', 'string') declare val: string
}
