import type { GroupShapeProperties } from './GroupShapeProperties'
import type { NonVisualGroupShapeProperties } from './NonVisualGroupShapeProperties'
import { defineChild, defineElement, defineProperty, OXML } from '../../core'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.groupshape
 */
@defineElement('p:grpSp')
export class GroupShape extends OXML {
  @defineChild('p:nvGrpSpPr') declare nvGrpSpPr: NonVisualGroupShapeProperties
  @defineChild('p:grpSpPr') declare grpSpPr: GroupShapeProperties

  @defineProperty() type = 'groupShape'
  @defineProperty('nvSpPr.cNvPr.id') declare id?: string
  @defineProperty('nvSpPr.cNvPr.name') declare name?: string
  @defineProperty() style = new _GroupShapeStyle(this)
  @defineProperty('_elements') declare elements: OXML[]

  protected get _elements(): OXML[] {
    return Array.from(this.element.children).map(element => OXML.make(element))
  }
}

export class _GroupShapeStyle extends OXML {
  @defineProperty('_parent.grpSpPr.xfrm.off.x') declare left: number
  @defineProperty('_parent.grpSpPr.xfrm.off.y') declare top: number
  @defineProperty('_parent.grpSpPr.xfrm.ext.cx') declare width: number
  @defineProperty('_parent.grpSpPr.xfrm.ext.cy') declare height: number
  @defineProperty('_parent.grpSpPr.xfrm.rot') declare rotate: number
  @defineProperty('_parent.grpSpPr.xfrm.flipH') declare flipH: boolean
  @defineProperty('_parent.grpSpPr.xfrm.flipV') declare flipV: boolean
  @defineProperty('_parent.grpSpPr.xfrm.chOff.x') declare childLeft: number
  @defineProperty('_parent.grpSpPr.xfrm.chOff.y') declare childTop: number
  @defineProperty('_parent.grpSpPr.xfrm.chExt.cx') declare childWidth: number
  @defineProperty('_parent.grpSpPr.xfrm.chExt.cy') declare childHeight: number

  constructor(
    protected _parent: GroupShape,
  ) {
    super()
  }
}
