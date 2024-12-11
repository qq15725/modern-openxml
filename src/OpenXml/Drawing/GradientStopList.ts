import type { GradientStop } from './GradientStop'
import { defineChildren, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.gradientstoplist
 */
@defineElement('a:gsLst')
export class GradientStopList extends OOXML {
  @defineChildren('a:gs') declare value: GradientStop[]
}
