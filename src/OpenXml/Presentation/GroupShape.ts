import type { BlipFillJSON, Fill } from '../Drawing'
import type { SlideContext, SlideElement, SlideElementJSON } from './_Slide'
import type { GroupShapeProperties } from './GroupShapeProperties'
import type { NonVisualGroupShapeProperties } from './NonVisualGroupShapeProperties'
import type { PlaceholderShapeJSON } from './PlaceholderShape'
import type { Shape } from './Shape'
import { defineChild, defineElement, filterObjectEmptyAttr, OOXML } from '../../core'
import { _SlideElement } from './_SlideElement'

export interface GroupShapeJSON {
  type: 'groupShape'
  name?: string
  placeholderShape?: PlaceholderShapeJSON
  childOffsetLeft?: number
  childOffsetTop?: number
  childWidth?: number
  childHeight?: number
  background?: BlipFillJSON
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
    shadow?: string
  }
  elements: SlideElementJSON[]
}

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.groupshape
 */
@defineElement('p:grpSp')
export class GroupShape extends _SlideElement {
  @defineChild('p:nvGrpSpPr') declare nvGrpSpPr?: NonVisualGroupShapeProperties
  @defineChild('p:grpSpPr') declare grpSpPr: GroupShapeProperties

  get elements(): SlideElement[] {
    return Array.from(this.element.children)
      .map((element) => {
        switch (element.tagName) {
          case 'p:nvGrpSpPr':
          case 'p:grpSpPr':
            return undefined
          case 'p:sp':
          case 'p:grpSp':
          case 'p:cxnSp':
          case 'p:pic':
          case 'p:graphicFrame':
          default:
            return OOXML.make(element)
        }
      })
      .filter(Boolean) as any[]
  }

  override hasPh(): boolean {
    return Boolean(this.nvGrpSpPr?.nvPr?.ph)
  }

  override toJSON(ctx: SlideContext = {}): GroupShapeJSON {
    const { layout, master } = ctx

    // ph
    let _ph: Shape | undefined
    const ph = this.nvGrpSpPr?.nvPr.ph
    if (ph) {
      _ph = (layout?.findPh(ph) ?? master?.findPh(ph)) as Shape | undefined
    }

    const inherited = <T>(path: string): T | undefined => {
      return this.offsetGet(path)
        ?? _ph?.offsetGet(path) as T
    }

    const fill = inherited<Fill>('grpSpPr.fill')?.toJSON(ctx)

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

    const outlineFill = inherited<Fill>('grpSpPr.ln.fill')?.toJSON(ctx)

    let outlineColor
    switch (outlineFill?.type) {
      case 'solidFill':
        outlineColor = outlineFill.color
        break
    }

    return filterObjectEmptyAttr({
      type: 'groupShape',
      name: inherited('nvGrpSpPr.cNvPr.name'),
      placeholderShape: ph?.toJSON(),
      childOffsetLeft: inherited('grpSpPr.xfrm.chOff.x'),
      childOffsetTop: inherited('grpSpPr.xfrm.chOff.y'),
      childWidth: inherited('grpSpPr.xfrm.chExt.cx'),
      childHeight: inherited('grpSpPr.xfrm.chExt.cy'),
      background,
      style: {
        visibility: inherited('nvGrpSpPr.cNvPr.visibility'),
        left: inherited('grpSpPr.xfrm.off.x'),
        top: inherited('grpSpPr.xfrm.off.y'),
        width: inherited('grpSpPr.xfrm.ext.cx'),
        height: inherited('grpSpPr.xfrm.ext.cy'),
        rotate: inherited('grpSpPr.xfrm.rot'),
        scaleX: inherited('grpSpPr.xfrm.scaleX'),
        scaleY: inherited('grpSpPr.xfrm.scaleY'),
        backgroundColor: fillColor,
        borderWidth: inherited('grpSpPr.ln.w'),
        borderColor: outlineColor,
        shadow: inherited('grpSpPr.effectLst.shadow'),
      },
      elements: this.elements.map(el => el.toJSON(ctx)),
    })
  }
}
