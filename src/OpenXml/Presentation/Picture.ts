import type { GeometryPath } from '../Drawing'
import type { SlideContext } from './_Slide'
import type { BlipFill } from './BlipFill'
import type { NonVisualPictureProperties } from './NonVisualPictureProperties'
import type { ShapeProperties } from './ShapeProperties'
import type { ShapeStyle } from './ShapeStyle'
import { defineChild, defineElement, filterObjectEmptyAttr, getObjectValueByPath } from '../../core'
import { _SlideElement } from './_SlideElement'

export interface PictureJSON {
  type: 'picture'
  name?: string
  src?: string
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
    shadow?: string
  }
}

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.picture
 */
@defineElement('p:pic')
export class Picture extends _SlideElement {
  @defineChild('p:blipFill') declare blipFill?: BlipFill
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

    const inherited = (path: string): any => {
      return this.offsetGet(path)
        ?? getObjectValueByPath(_style, path.replace('spPr.', ''))
        ?? _ph?.offsetGet(path)
    }

    const width = inherited('spPr.xfrm.ext.cx')
    const height = inherited('spPr.xfrm.ext.cy')
    const background = inherited('spPr')?.toFillJSON(ctx)
    const border = inherited('spPr.ln')?.toFillJSON(ctx)

    return filterObjectEmptyAttr({
      type: 'picture',
      name: inherited('nvPicPr.cNvPr.name'),
      src: inherited('blipFill.blip.rEmbed'),
      // TODO prstGeom
      geometry: inherited('spPr.custGeom')?.getPaths(
        width ?? 0,
        height ?? 0,
        inherited('spPr.custGeom.pathLst'),
        inherited('spPr.custGeom.avLst'),
        inherited('spPr.custGeom.gdLst'),
      ),
      style: {
        visibility: inherited('nvPicPr.cNvPr.visibility'),
        left: inherited('spPr.xfrm.off.x'),
        top: inherited('spPr.xfrm.off.y'),
        width,
        height,
        rotate: inherited('spPr.xfrm.rot'),
        scaleX: inherited('spPr.xfrm.scaleX'),
        scaleY: inherited('spPr.xfrm.scaleY'),
        backgroundColor: background?.color,
        backgroundImage: background?.image,
        borderWidth: inherited('spPr.ln.w'),
        borderColor: border?.color,
        borderImage: border?.image,
        shadow: inherited('spPr.effectLst.shadow'),
      },
    })
  }
}
