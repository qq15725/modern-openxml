import { defineElement, defineProperty, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.nonvisualdrawingproperties
 */
@defineElement('cNvPr', 'p')
export class NonVisualDrawingProperties extends OXML {
  @defineProperty('id', 'string') declare id: string
  @defineProperty('name', 'string') declare name: string
}
