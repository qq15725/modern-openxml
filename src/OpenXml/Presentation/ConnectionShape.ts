import type { CustomGeometry, Fill, GeometryPath, PresetGeometry } from '../Drawing'
import type { SlideContext } from './_Slide'
import type { ExtensionList } from './ExtensionList'
import type { NonVisualConnectionShapeProperties } from './NonVisualConnectionShapeProperties'
import type { ShapeProperties } from './ShapeProperties'
import type { ShapeStyle } from './ShapeStyle'
import { defineChild, defineElement, filterObjectEmptyAttr, getObjectValueByPath } from '../../core'
import { _SlideElement } from './_SlideElement'

export interface ConnectionShapeJSON {
  type: 'connectionShape'
  name?: string
  geometry?: GeometryPath[]
  style: {
    visibility?: 'hidden'
    left?: number
    top?: number
    width?: number
    height?: number
    rotate?: number
    backgroundColor?: string
    backgroundImage?: string
    borderColor?: string
    borderImage?: string
    scaleX?: number
    scaleY?: number
    borderWidth?: number
    paddingLeft?: number
    paddingTop?: number
    paddingRight?: number
    paddingBottom?: number
    textRotate?: number
    writingMode?: 'horizontal-tb' | 'vertical-lr' | 'vertical-rl'
    textWrap?: 'wrap' | 'nowrap'
    textAlign?: 'center' | 'start'
    verticalAlign?: 'top' | 'middle' | 'bottom'
    shadow?: string
  }
}

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.connectionshape
 */
@defineElement('p:cxnSp')
export class ConnectionShape extends _SlideElement {
  @defineChild('p:extLst') declare extLst?: ExtensionList
  @defineChild('p:nvCxnSpPr') declare nvCxnSpPr?: NonVisualConnectionShapeProperties
  @defineChild('p:spPr') declare spPr?: ShapeProperties
  @defineChild('p:style') declare style?: ShapeStyle

  override hasPh(): boolean {
    return Boolean(this.nvCxnSpPr?.nvPr?.ph)
  }

  override toJSON(ctx: SlideContext = {}): ConnectionShapeJSON {
    const { layout, master } = ctx

    // ph
    let _ph: ConnectionShape | undefined
    const ph = this.nvCxnSpPr?.nvPr.ph
    if (ph) {
      _ph = (layout?.findPh(ph) ?? master?.findPh(ph)) as ConnectionShape | undefined
    }

    // style
    const _style = this.style?.parse(ctx)

    const inherited = <T = any>(path: string): T | undefined => {
      return this.offsetGet(path)
        ?? getObjectValueByPath(_style, path.replace('spPr.', ''))
        ?? _ph?.offsetGet(path)
    }

    const width = inherited('spPr.xfrm.ext.cx')
    const height = inherited('spPr.xfrm.ext.cy')
    const prstGeom = inherited<PresetGeometry>('spPr.prstGeom')
    const custGeom = inherited<CustomGeometry>('spPr.custGeom')
    let background
    let border
    let borderWidth
    let geometry
    const fill = inherited<Fill>('spPr.fill')?.toJSON({
      ...ctx,
      color: this.spPr?.fill ? undefined : this.style?.fillRef?.color,
    })
    const stroke = inherited<Fill>('spPr.ln.fill')?.toJSON({
      ...ctx,
      color: this.spPr?.ln?.fill ? undefined : this.style?.lnRef?.color,
    })
    const strokeWidth = inherited('spPr.ln.w')
    if (prstGeom?.prst === 'rect') {
      background = fill
      border = stroke
      borderWidth = strokeWidth
    }
    else {
      geometry = (prstGeom ?? custGeom)?.getPaths({
        width: width || strokeWidth,
        height: height || strokeWidth,
        fill: fill?.color,
        stroke: stroke?.color,
        strokeWidth,
      })
    }
    return filterObjectEmptyAttr({
      type: 'connectionShape',
      name: inherited('nvCxnSpPr.cNvPr.name'),
      geometry,
      style: {
        visibility: inherited('nvCxnSpPr.cNvPr.visibility'),
        left: inherited('spPr.xfrm.off.x'),
        top: inherited('spPr.xfrm.off.y'),
        width,
        height,
        rotate: inherited('spPr.xfrm.rot'),
        scaleX: inherited('spPr.xfrm.scaleX'),
        scaleY: inherited('spPr.xfrm.scaleY'),
        backgroundColor: background?.color,
        backgroundImage: background?.image,
        borderWidth,
        borderColor: border?.color,
        borderImage: border?.image,
        shadow: inherited('spPr.effectLst.shadow'),
      },
    })
  }
}
