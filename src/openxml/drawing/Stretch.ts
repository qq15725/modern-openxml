import { defineChild } from '../../core'
import { _Namespace } from './_Namespace'
import { FillRectangle } from './FillRectangle'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.stretch
 */
export class Stretch extends _Namespace {
  readonly tag = 'stretch'

  @defineChild('a:fillRect', FillRectangle) fillRect?: FillRectangle
}
