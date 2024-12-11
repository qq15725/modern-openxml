import type { ConnectionShape } from './ConnectionShape'
import type { GraphicFrame } from './GraphicFrame'
import type { GroupShapeProperties } from './GroupShapeProperties'
import type { NonVisualGroupShapeProperties } from './NonVisualGroupShapeProperties'
import type { Picture } from './Picture'
import type { Shape } from './Shape'
import { defineChild, defineElement, defineProperty, OOXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.groupshape
 */
@defineElement('p:grpSp')
export class GroupShape extends OOXML {
  @defineChild('p:nvGrpSpPr') declare nvGrpSpPr: NonVisualGroupShapeProperties
  @defineChild('p:grpSpPr') declare grpSpPr: GroupShapeProperties

  @defineProperty() type = 'groupShape'
  @defineProperty('nvSpPr.cNvPr.name') declare name?: string
  @defineProperty() style = new _GroupShapeStyle(this)
  @defineProperty('_elements') declare elements: (Shape | GroupShape | Picture | ConnectionShape | GraphicFrame)[]

  get _elements(): (Shape | GroupShape | Picture | ConnectionShape | GraphicFrame)[] {
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
}

export class _GroupShapeStyle extends OOXML {
  @defineProperty('_parent.grpSpPr.xfrm.off.x') declare left: number
  @defineProperty('_parent.grpSpPr.xfrm.off.y') declare top: number
  @defineProperty('_parent.grpSpPr.xfrm.ext.cx') declare width: number
  @defineProperty('_parent.grpSpPr.xfrm.ext.cy') declare height: number
  @defineProperty('_parent.grpSpPr.xfrm.rot') declare rotate: number
  @defineProperty('_scaleX') declare scaleX?: number
  @defineProperty('_scaleY') declare scaleY?: number
  @defineProperty('_parent.grpSpPr.xfrm.chOff.x') declare childOffsetLeft: number
  @defineProperty('_parent.grpSpPr.xfrm.chOff.y') declare childOffsetTop: number
  @defineProperty('_parent.grpSpPr.xfrm.chExt.cx') declare childWidth: number
  @defineProperty('_parent.grpSpPr.xfrm.chExt.cy') declare childHeight: number

  protected get _scaleX(): number | undefined {
    return this._parent.grpSpPr.xfrm.flipH ? -1 : 1
  }

  protected get _scaleY(): number | undefined {
    return this._parent.grpSpPr.xfrm.flipV ? -1 : 1
  }

  constructor(
    protected _parent: GroupShape,
  ) {
    super()
  }
}
