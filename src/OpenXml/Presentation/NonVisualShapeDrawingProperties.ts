import { defineAttribute, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.nonvisualshapedrawingproperties
 */
@defineElement('p:cNvSpPr')
export class NonVisualShapeDrawingProperties extends OXML {
  @defineAttribute('txBox', { type: 'boolean', defaultValue: true }) declare txBox: boolean
}
