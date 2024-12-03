import { defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.defaulttextstyle
 */
@defineElement('defaultTextStyle', 'p')
export class DefaultTextStyle extends OXML {
  // TODO
  // a:lvl1pPr - a:lvl9pPr
}
