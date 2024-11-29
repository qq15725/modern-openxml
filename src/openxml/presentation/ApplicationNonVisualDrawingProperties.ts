import { defineChild } from '../../core'
import { _Namespace } from './_Namespace'
import { PlaceholderShape } from './PlaceholderShape'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.applicationnonvisualdrawingproperties
 */
export class ApplicationNonVisualDrawingProperties extends _Namespace {
  readonly tag = 'nvPr'

  @defineChild('p:ph', PlaceholderShape) declare ph: PlaceholderShape
}
