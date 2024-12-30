import type { IDOCElement, IDOCImageProp, IDOCStyleProp } from 'modern-idoc'
import type {
  CustomGeometry,
  Fill,
  PresetGeometry,
} from '../Drawing'
import type { SlideContext } from './_Slide'
import type { BlipFill } from './BlipFill'
import type { NonVisualPictureProperties } from './NonVisualPictureProperties'
import type { IDOCPlaceholderShape } from './PlaceholderShape'
import type { ShapeProperties } from './ShapeProperties'
import type { ShapeStyle } from './ShapeStyle'
import { clearEmptyAttrs, defineChild, defineElement, getObjectValueByPath } from '../../core'

import { _SlideElement } from './_SlideElement'

export interface IDOCPictureElementMeta {
  type: 'picture'
  placeholderShape?: IDOCPlaceholderShape
}

export interface IDOCPictureElement extends IDOCElement {
  meta: IDOCPictureElementMeta
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

  override toIDOC(ctx: SlideContext = {}): IDOCPictureElement {
    const { layout, master } = ctx

    // ph
    let _ph: Picture | undefined
    const ph = this.nvPicPr?.nvPr.ph
    if (ph) {
      _ph = (layout?.findPh(ph) ?? master?.findPh(ph)) as Picture | undefined
    }

    // style
    const _style = this.style?.parse(ctx)

    const inherited = <T = any>(path: string): T | undefined => {
      return this.offsetGet(path)
        ?? getObjectValueByPath(_style, path.replace('spPr.', ''))
        ?? _ph?.offsetGet(path)
    }

    const style: IDOCStyleProp = {
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

    const fill = inherited<Fill>('spPr.fill')?.toIDOC({
      ...ctx,
      color: this.spPr?.hasFill
        ? undefined
        : this.style?.fillRef?.color,
    })

    const storke = inherited<Fill>('spPr.ln.fill')?.toIDOC({
      ...ctx,
      color: this.spPr?.ln?.hasFill
        ? undefined
        : this.style?.lnRef?.color,
    })

    const prstGeom = inherited<PresetGeometry>('spPr.prstGeom')
    const custGeom = inherited<CustomGeometry>('spPr.custGeom')
    let geometry
    const outlineWidth = inherited('spPr.ln.w')
    if (prstGeom?.prst === 'rect' && !prstGeom?.avLst?.value.length) {
      // style.backgroundColor = fillColor
      // style.borderColor = outlineColor
      style.borderWidth = outlineWidth
    }
    else {
      geometry = (prstGeom ?? custGeom)?.toIDOC({
        ...ctx,
        width: style.width || outlineWidth,
        height: style.height || outlineWidth,
        // fill: fillColor,
        // stroke: outlineColor,
        strokeWidth: outlineWidth,
      })
    }

    return clearEmptyAttrs({
      name: inherited('nvPicPr.cNvPr.name'),
      geometry,
      image: inherited<BlipFill>('blipFill')!.toIDOC() as IDOCImageProp,
      fill,
      storke,
      style,
      meta: {
        type: 'picture',
        placeholderShape: ph?.toIDOC(),
      },
    })
  }
}
