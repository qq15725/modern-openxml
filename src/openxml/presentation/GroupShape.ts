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

  @defineProperty(['getElements']) declare elements: OXML[]

  getElements(): OXML[] {
    return getElements(this.element.children)
  }
}
