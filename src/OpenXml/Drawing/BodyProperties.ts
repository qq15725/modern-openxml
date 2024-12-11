import type {
  TextAnchoringTypeValues,
  TextHorizontalOverflowValues,
  TextVerticalOverflowValues,
  TextVerticalValues,
  TextWrappingValues,
} from './_types'
import { defineAttribute, defineElement, OOXML } from '../../core'

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.drawing.bodyproperties
 */
@defineElement('a:bodyPr')
export class BodyProperties extends OOXML {
  @defineAttribute('anchor') declare anchor?: TextAnchoringTypeValues
  @defineAttribute('anchorCtr', 'boolean') declare anchorCtr?: boolean
  @defineAttribute('bIns', 'ST_Coordinate32') declare bIns?: number
  @defineAttribute('numCol', 'ST_TextColumnCount') declare numCol?: number
  @defineAttribute('spcCol', 'ST_PositiveCoordinate32') declare spcCol?: number
  @defineAttribute('compatLnSpc', 'boolean') declare compatLnSpc?: boolean
  @defineAttribute('forceAA', 'boolean') declare forceAA?: boolean
  @defineAttribute('fromWordArt', 'boolean') declare fromWordArt?: boolean
  @defineAttribute('horzOverflow') declare horzOverflow?: TextHorizontalOverflowValues
  @defineAttribute('lIns', 'ST_Coordinate32') declare lIns?: number
  @defineAttribute('rIns', 'ST_Coordinate32') declare rIns?: number
  @defineAttribute('rtlCol', 'boolean') declare rtlCol?: boolean
  @defineAttribute('rot', 'ST_Angle') declare rot?: number
  @defineAttribute('tIns', 'ST_Coordinate32') declare tIns?: number
  @defineAttribute('upright', 'boolean') declare upright?: boolean
  @defineAttribute('spcFirstLastPara', 'boolean') declare spcFirstLastPara?: boolean
  @defineAttribute('vert') declare vert?: TextVerticalValues
  @defineAttribute('vertOverflow') declare vertOverflow?: TextVerticalOverflowValues
  @defineAttribute('wrap') declare wrap?: TextWrappingValues
}
