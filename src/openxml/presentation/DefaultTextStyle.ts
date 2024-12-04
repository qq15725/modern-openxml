import { defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.defaulttextstyle
 */
@defineElement('p:defaultTextStyle')
export class DefaultTextStyle extends OXML {
  // TODO
  // a:lvl1pPr - a:lvl9pPr
}
