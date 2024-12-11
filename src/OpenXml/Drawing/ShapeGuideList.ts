import type { ShapeGuide } from './ShapeGuide'
import { defineChildren, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.shapeguidelist
 */
@defineElement('a:gdLst')
export class ShapeGuideList extends OOXML {
  @defineChildren('a:gd') declare value: ShapeGuide[]
}
