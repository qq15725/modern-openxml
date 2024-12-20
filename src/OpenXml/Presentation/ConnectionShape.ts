import type {
  BlipFillJSON,
  CustomGeometry,
  CustomGeometryJSON,
  Fill,
  PresetGeometry,
  PresetGeometryJSON,
} from '../Drawing'
import type { SlideContext } from './_Slide'
import type { ExtensionList } from './ExtensionList'
import type { NonVisualConnectionShapeProperties } from './NonVisualConnectionShapeProperties'
import type { PlaceholderShapeJSON } from './PlaceholderShape'
import type { ShapeProperties } from './ShapeProperties'
import type { ShapeStyle } from './ShapeStyle'
import { defineChild, defineElement, filterObjectEmptyAttr, getObjectValueByPath } from '../../core'
import { _SlideElement } from './_SlideElement'

export interface ConnectionShapeJSON {
  type: 'connectionShape'
  name?: string
  placeholderShape?: PlaceholderShapeJSON
  geometry?: PresetGeometryJSON | CustomGeometryJSON
  background?: BlipFillJSON
  style: {
    visibility?: 'hidden'
    left?: number
    top?: number
    width?: number
    height?: number
    rotate?: number
    scaleX?: number
    scaleY?: number
    backgroundColor?: string
    borderColor?: string
    borderWidth?: number
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

    const style: ConnectionShapeJSON['style'] = {
      visibility: inherited('nvCxnSpPr.cNvPr.visibility'),
      left: inherited('spPr.xfrm.off.x'),
      top: inherited('spPr.xfrm.off.y'),
      width: inherited('spPr.xfrm.ext.cx'),
      height: inherited('spPr.xfrm.ext.cy'),
      rotate: inherited('spPr.xfrm.rot'),
      scaleX: inherited('spPr.xfrm.scaleX'),
      scaleY: inherited('spPr.xfrm.scaleY'),
      shadow: inherited('spPr.effectLst.shadow'),
      backgroundColor: undefined,
      borderWidth: undefined,
      borderColor: undefined,
    }

    const fill = inherited<Fill>('spPr.fill')?.toJSON({
      ...ctx,
      color: this.spPr?.hasFill
        ? undefined
        : this.style?.fillRef?.color,
    })

    let fillColor
    let background: BlipFillJSON | undefined
    switch (fill?.type) {
      case 'solidFill':
        fillColor = fill.color
        break
      case 'blipFill':
        background = fill
        break
    }

    const outlineFill = inherited<Fill>('spPr.ln.fill')?.toJSON({
      ...ctx,
      color: this.spPr?.ln?.hasFill
        ? undefined
        : this.style?.lnRef?.color,
    })

    let outlineColor
    switch (outlineFill?.type) {
      case 'solidFill':
        outlineColor = outlineFill.color
        break
    }

    const prstGeom = inherited<PresetGeometry>('spPr.prstGeom')
    const custGeom = inherited<CustomGeometry>('spPr.custGeom')
    let geometry
    const outlineWidth = inherited('spPr.ln.w')
    if (prstGeom?.prst === 'rect' && !prstGeom?.avLst?.value.length) {
      style.backgroundColor = fillColor
      style.borderColor = outlineColor
      style.borderWidth = outlineWidth
    }
    else {
      geometry = (prstGeom ?? custGeom)?.toJSON({
        ...ctx,
        width: style.width || outlineWidth,
        height: style.height || outlineWidth,
        fill: fillColor,
        stroke: outlineColor,
        strokeWidth: outlineWidth,
      })
    }

    return filterObjectEmptyAttr({
      type: 'connectionShape',
      name: inherited('nvCxnSpPr.cNvPr.name'),
      placeholderShape: ph?.toJSON(),
      geometry,
      background,
      style,
    } as ConnectionShapeJSON)
  }
}
