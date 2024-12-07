import type { GradientStop } from './GradientStop'
import { defineChildren, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.gradientstoplist
 */
@defineElement('a:gsLst')
export class GradientStopList extends OXML {
  @defineChildren('a:gs') declare value: GradientStop[]
}
