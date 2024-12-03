import type { PlaceholderShape } from './PlaceholderShape'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.applicationnonvisualdrawingproperties
 */
@defineElement('nvPr', 'p')
export class ApplicationNonVisualDrawingProperties extends OXML {
  @defineChild('ph') declare ph: PlaceholderShape
}
