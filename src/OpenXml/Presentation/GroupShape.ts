import type { SlideContext, SlideElement, SlideElementJSON } from './_Slide'
import type { GroupShapeProperties } from './GroupShapeProperties'
import type { NonVisualGroupShapeProperties } from './NonVisualGroupShapeProperties'
import type { Shape } from './Shape'
import { defineChild, defineElement, filterObjectEmptyAttr, OOXML } from '../../core'
import { _SlideElement } from './_SlideElement'

export interface GroupShapeJSON {
  type: 'groupShape'
  name?: string
  style: {
    visibility?: 'hidden'
    left?: number
    top?: number
    width?: number
    height?: number
    childOffsetLeft?: number
    childOffsetTop?: number
    childWidth?: number
    childHeight?: number
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

    const inherited = (path: string): any => {
      return this.offsetGet(path)
        ?? _ph?.offsetGet(path)
    }

    const width = inherited('grpSpPr.xfrm.ext.cx')
    const height = inherited('grpSpPr.xfrm.ext.cy')
    const background = inherited('grpSpPr.fill')?.toJSON(ctx)
    const border = inherited('grpSpPr.ln.fill')?.toJSON(ctx)

    return filterObjectEmptyAttr({
      type: 'groupShape',
      name: inherited('nvGrpSpPr.cNvPr.name'),
      style: {
        visibility: inherited('nvGrpSpPr.cNvPr.visibility'),
        left: inherited('grpSpPr.xfrm.off.x'),
        top: inherited('grpSpPr.xfrm.off.y'),
        width,
        height,
        childOffsetLeft: inherited('grpSpPr.xfrm.chOff.x'),
        childOffsetTop: inherited('grpSpPr.xfrm.chOff.y'),
        childWidth: inherited('grpSpPr.xfrm.chExt.cx'),
        childHeight: inherited('grpSpPr.xfrm.chExt.cy'),
        rotate: inherited('grpSpPr.xfrm.rot'),
        scaleX: inherited('grpSpPr.xfrm.scaleX'),
        scaleY: inherited('grpSpPr.xfrm.scaleY'),
        backgroundColor: background?.color,
        backgroundImage: background?.image,
        borderWidth: inherited('grpSpPr.ln.w'),
        borderColor: border?.color,
        borderImage: border?.image,
        shadow: inherited('grpSpPr.effectLst.shadow'),
      },
      elements: this.elements.map(el => el.toJSON(ctx)),
    })
  }
}
