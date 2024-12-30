import type { IDOCElement } from 'modern-idoc'
import type { Fill } from '../Drawing'
import type { IDOCSlideChildElement, SlideContext, SlideElement } from './_Slide'
import type { GroupShapeProperties } from './GroupShapeProperties'
import type { NonVisualGroupShapeProperties } from './NonVisualGroupShapeProperties'
import type { IDOCPlaceholderShape } from './PlaceholderShape'
import type { Shape } from './Shape'
import { clearEmptyAttrs, defineChild, defineElement, OOXML } from '../../core'
import { _SlideElement } from './_SlideElement'

export interface IDOCGroupShapeMeta {
  type: 'groupShape'
  placeholderShape?: IDOCPlaceholderShape
}

export interface IDOCGroupShapeElement extends IDOCElement {
  childOffsetLeft?: number
  childOffsetTop?: number
  childWidth?: number
  childHeight?: number
  children: IDOCSlideChildElement[]
  meta: IDOCGroupShapeMeta
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

  override toIDOC(ctx: SlideContext = {}): IDOCGroupShapeElement {
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

    const fill = inherited<Fill>('grpSpPr.fill')?.toIDOC(ctx)
    const stroke = inherited<Fill>('grpSpPr.ln.fill')?.toIDOC(ctx)

    return clearEmptyAttrs({
      name: inherited('nvGrpSpPr.cNvPr.name'),
      childOffsetLeft: inherited('grpSpPr.xfrm.chOff.x'),
      childOffsetTop: inherited('grpSpPr.xfrm.chOff.y'),
      childWidth: inherited('grpSpPr.xfrm.chExt.cx'),
      childHeight: inherited('grpSpPr.xfrm.chExt.cy'),
      fill,
      stroke,
      style: {
        visibility: inherited('nvGrpSpPr.cNvPr.visibility'),
        left: inherited('grpSpPr.xfrm.off.x'),
        top: inherited('grpSpPr.xfrm.off.y'),
        width: inherited('grpSpPr.xfrm.ext.cx'),
        height: inherited('grpSpPr.xfrm.ext.cy'),
        rotate: inherited('grpSpPr.xfrm.rot'),
        scaleX: inherited('grpSpPr.xfrm.scaleX'),
        scaleY: inherited('grpSpPr.xfrm.scaleY'),
        borderWidth: inherited('grpSpPr.ln.w'),
        shadow: inherited('grpSpPr.effectLst.shadow'),
      },
      children: this.elements.map(el => el.toIDOC(ctx)),
      meta: {
        type: 'groupShape',
        placeholderShape: ph?.toIDOC(),
      },
    })
  }
}
