import type { ShapeGuide } from './ShapeGuide'
import { defineChildren, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.adjustvaluelist
 */
@defineElement('a:avLst')
export class AdjustValueList extends OXML {
  @defineChildren('a:gd') declare value: ShapeGuide[]
}
