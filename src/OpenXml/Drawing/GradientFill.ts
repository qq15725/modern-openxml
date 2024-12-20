import type { GradientStopList } from './GradientStopList'
import type { LinearGradientFill } from './LinearGradientFill'
import type { Path } from './Path'
import type { TileRectangle } from './TileRectangle'
import { defineChild, defineElement, OOXML } from '../../core'

export interface GradientFillJSON {
  type: 'gradientFill'
}

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.gradientfill
 */
@defineElement('a:gradFill')
export class GradientFill extends OOXML {
  @defineChild('a:gsLst') gsLst?: GradientStopList
  @defineChild('a:lin') lin?: LinearGradientFill
  @defineChild('a:path') path?: Path
  @defineChild('a:tileRect') tileRect?: TileRectangle

  override toJSON(): GradientFillJSON {
    return {
      type: 'gradientFill',
    }
  }
}
