import { defineAttribute, defineElement } from '../../core'
import { _Color } from './_Color'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.innershadow
 */
@defineElement('a:innerShdw')
export class InnerShadow extends _Color {
  @defineAttribute('blurRad', 'ST_PositiveCoordinate') declare blurRad?: number
  @defineAttribute('dir', 'ST_PositiveFixedAngle') declare dir?: number
  @defineAttribute('dist', 'ST_PositiveCoordinate') declare dist?: number
}
