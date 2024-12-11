import type { ShapeGuide } from './ShapeGuide'
import { defineChildren, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.adjustvaluelist
 */
@defineElement('a:avLst')
export class AdjustValueList extends OOXML {
  @defineChildren('a:gd') declare value: ShapeGuide[]
}
