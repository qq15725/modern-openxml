import type { Point } from './Point'
import { defineChildren, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.cubicbeziercurveto
 */
@defineElement('a:cubicBezTo')
export class CubicBezierCurveTo extends OOXML {
  @defineChildren('a:pt') declare value: Point[]
}
