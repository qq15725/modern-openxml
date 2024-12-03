import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.nonvisualshapedrawingproperties
 */
@defineElement('cNvSpPr', 'p')
export class NonVisualShapeDrawingProperties extends OXML {
  @defineAttribute('txBox', 'boolean') txBox?: boolean
}
