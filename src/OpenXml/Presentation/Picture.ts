import type {
  BlipFillJSON,
  CustomGeometry,
  CustomGeometryJSON,
  Fill,
  PresetGeometry,
  PresetGeometryJSON,
} from '../Drawing'
import type { SlideContext } from './_Slide'
import type { BlipFill } from './BlipFill'
import type { NonVisualPictureProperties } from './NonVisualPictureProperties'
import type { PlaceholderShapeJSON } from './PlaceholderShape'
import type { ShapeProperties } from './ShapeProperties'
import type { ShapeStyle } from './ShapeStyle'
import { defineChild, defineElement, filterObjectEmptyAttr, getObjectValueByPath } from '../../core'

import { _SlideElement } from './_SlideElement'

export interface PictureJSON {
  type: 'picture'
  name?: string
  placeholderShape?: PlaceholderShapeJSON
  geometry?: PresetGeometryJSON | CustomGeometryJSON
  image: BlipFillJSON
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
    shadow?: string
    backgroundColor?: string
    borderColor?: string
    borderWidth?: number
  }
}

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.picture
 */
@defineElement('p:pic')
export class Picture extends _SlideElement {
  @defineChild('p:blipFill', { required: true }) declare blipFill: BlipFill
  @defineChild('p:nvPicPr') declare nvPicPr?: NonVisualPictureProperties
  @defineChild('p:spPr') declare spPr?: ShapeProperties
  @defineChild('p:style') declare style?: ShapeStyle

  override hasPh(): boolean {
    return Boolean(this.nvPicPr?.nvPr?.ph)
  }

  override toJSON(ctx: SlideContext = {}): PictureJSON {
    const { layout, master } = ctx

    // ph
    let _ph: Picture | undefined
    const ph = this.nvPicPr?.nvPr.ph
    if (ph) {
      _ph = (layout?.findPh(ph) ?? master?.findPh(ph)) as Picture | undefined
    }

    // style
    const _style = this.style?.toJSON(ctx)

    const inherited = <T = any>(path: string): T | undefined => {
      return this.offsetGet(path)
        ?? getObjectValueByPath(_style, path.replace('spPr.', ''))
        ?? _ph?.offsetGet(path)
    }

    const style: PictureJSON['style'] = {
      visibility: inherited('nvPicPr.cNvPr.visibility'),
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
      type: 'picture',
      name: inherited('nvPicPr.cNvPr.name'),
      placeholderShape: ph?.toJSON(),
      geometry,
      image: inherited<BlipFill>('blipFill')!.toJSON(),
      background,
      style,
    } as PictureJSON)
  }
}
