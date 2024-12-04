import type { Point } from './Point'
import { defineChildren, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.quadraticbeziercurveto
 */
@defineElement('a:quadBezTo')
export class QuadraticBezierCurveTo extends OXML {
  @defineChildren('a:pt') declare value: Point[]
}
