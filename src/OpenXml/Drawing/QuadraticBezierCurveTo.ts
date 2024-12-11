import type { Point } from './Point'
import { defineChildren, defineElement, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.quadraticbeziercurveto
 */
@defineElement('a:quadBezTo')
export class QuadraticBezierCurveTo extends OOXML {
  @defineChildren('a:pt') declare value: Point[]
}
