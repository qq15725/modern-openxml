import type { ShapeGuide } from './ShapeGuide'
import { defineChildren, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.shapeguidelist
 */
@defineElement('a:gdLst')
export class ShapeGuideList extends OXML {
  @defineChildren('a:gd') declare value: ShapeGuide[]
}
