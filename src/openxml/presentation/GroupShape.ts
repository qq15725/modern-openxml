import type { GroupShapeProperties } from './GroupShapeProperties'
import type { NonVisualGroupShapeProperties } from './NonVisualGroupShapeProperties'
import { defineChild, defineElement, defineProperty, OXML } from '../../core'
import { getElements } from './_utils'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.groupshape
 */
@defineElement('p:grpSp')
export class GroupShape extends OXML {
  @defineChild('p:nvGrpSpPr') declare nvGrpSpPr: NonVisualGroupShapeProperties
  @defineChild('p:grpSpPr') declare grpSpPr: GroupShapeProperties

  @defineProperty('_type') declare type: string
  @defineProperty('nvSpPr.cNvPr.id') declare id?: string
  @defineProperty('nvSpPr.cNvPr.name') declare name?: string
  @defineProperty('grpSpPr.xfrm.off.x') declare left: number
  @defineProperty('grpSpPr.xfrm.off.y') declare top: number
  @defineProperty('grpSpPr.xfrm.ext.cx') declare width: number
  @defineProperty('grpSpPr.xfrm.ext.cy') declare height: number
  @defineProperty('grpSpPr.xfrm.chOff.x') declare childLeft: number
  @defineProperty('grpSpPr.xfrm.chOff.y') declare childTop: number
  @defineProperty('grpSpPr.xfrm.chExt.cx') declare childWidth: number
  @defineProperty('grpSpPr.xfrm.chExt.cy') declare childHeight: number
  @defineProperty('_elements') declare elements: OXML[]

  protected get _type(): string { return 'groupShape' }
  protected get _elements(): OXML[] { return getElements(this.element.children) }
}
