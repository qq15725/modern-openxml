import type { GradientStopList } from './GradientStopList'
import type { LinearGradientFill } from './LinearGradientFill'
import type { Path } from './Path'
import type { TileRectangle } from './TileRectangle'
import { defineChild, defineElement, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.gradientfill
 */
@defineElement('a:gradFill')
export class GradientFill extends OXML {
  @defineChild('a:gsLst') gsLst?: GradientStopList
  @defineChild('a:lin') lin?: LinearGradientFill
  @defineChild('a:path') path?: Path
  @defineChild('a:tileRect') tileRect?: TileRectangle
}