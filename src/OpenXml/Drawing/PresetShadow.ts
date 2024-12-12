import { defineAttribute, defineElement } from '../../core'
import { _ColorStyle } from './_ColorStyle'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.presetshadow
 */
@defineElement('a:prstShdw')
export class PresetShadow extends _ColorStyle {
  @defineAttribute('dir', 'ST_PositiveFixedAngle') declare dir?: number
  @defineAttribute('dist', 'ST_PositiveCoordinate') declare dist?: number
  @defineAttribute('prst', 'ST_PresetShadowVal') declare prst?: string
}
