import { defineNode, XmlObject } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.defaulttextstyle
 */
@defineNode('defaultTextStyle', 'p')
export class DefaultTextStyle extends XmlObject {
  // TODO
  // a:lvl1pPr - a:lvl9pPr
}
