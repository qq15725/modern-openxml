import { defineAttribute, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.nonvisualshapedrawingproperties
 */
@defineElement('p:cNvSpPr')
export class NonVisualShapeDrawingProperties extends OOXML {
  @defineAttribute('txBox', { type: 'boolean', defaultValue: true }) declare txBox: boolean
}
