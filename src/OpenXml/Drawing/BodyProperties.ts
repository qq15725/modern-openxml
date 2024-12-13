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

  get writingMode(): 'horizontal-tb' | 'vertical-lr' | 'vertical-rl' | undefined {
    switch (this.vert) {
      case 'eaVert':
      case 'mongolianVert':
      case 'vert':
      case 'vert270':
      case 'wordArtVertRtl':
      case 'wordArtVert':
        return 'vertical-rl'
      case 'horz':
        return 'horizontal-tb'
    }

    switch (this.upright) {
      case true:
        return 'vertical-rl'
      case false:
        return 'horizontal-tb'
    }

    return undefined
  }

  get textWrap(): 'wrap' | 'nowrap' | undefined {
    switch (this.wrap) {
      case 'none':
        return 'nowrap'
      case 'square':
        return 'wrap'
      default:
        return undefined
    }
  }

  get verticalAlign(): 'top' | 'middle' | 'bottom' | undefined {
    switch (this.anchor) {
      case 't':
        return 'top'
      case 'b':
        return 'bottom'
      case 'ctr':
        return 'middle'
      default:
        return undefined
    }
  }

  get textAlign(): 'center' | 'start' | undefined {
    switch (this.anchorCtr) {
      case true:
        return 'center'
      case false:
        return 'start'
      default:
        return undefined
    }
  }
}
