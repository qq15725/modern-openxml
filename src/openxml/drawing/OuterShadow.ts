import { defineAttribute, defineElement } from '../../core'
import { _Color } from './_Color'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.outershadow
 */
@defineElement('a:outerShdw')
export class OuterShadow extends _Color {
  @defineAttribute('algn', 'ST_RectAlignment') declare algn?: number
  @defineAttribute('blurRad', 'ST_PositiveCoordinate') declare blurRad?: number
  @defineAttribute('dir', 'ST_PositiveFixedAngle') declare dir?: number
  @defineAttribute('dist', 'ST_PositiveCoordinate') declare dist?: number
  @defineAttribute('kx', 'ST_FixedAngle') declare kx?: number
  @defineAttribute('ky', 'ST_FixedAngle') declare ky?: number
  @defineAttribute('rotWithShape', 'boolean') declare rotWithShape?: boolean
  @defineAttribute('sx', 'ST_Percentage') declare sx?: number
  @defineAttribute('sy', 'ST_Percentage') declare sy?: number
}
