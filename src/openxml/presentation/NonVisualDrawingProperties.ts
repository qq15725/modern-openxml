import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.nonvisualdrawingproperties
 */
@defineElement('cNvPr', 'p')
export class NonVisualDrawingProperties extends OXML {
  @defineAttribute('id') declare id: string
  @defineAttribute('name') declare name: string
}
