import type { Point } from './Point'
import { defineChildren, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.cubicbeziercurveto
 */
@defineElement('a:cubicBezTo')
export class CubicBezierCurveTo extends OXML {
  @defineChildren('a:pt') declare value: Point[]
}
