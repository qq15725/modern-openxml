import type { GroupShapeProperties } from './GroupShapeProperties'
import type { NonVisualGroupShapeProperties } from './NonVisualGroupShapeProperties'
import { defineChild, defineElement, OXML } from '../../core'
import { getElements } from './_utils'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.groupshape
 */
@defineElement('grpSp', 'p')
export class GroupShape extends OXML {
  @defineChild('nvGrpSpPr') declare nvGrpSpPr: NonVisualGroupShapeProperties
  @defineChild('grpSpPr') declare grpSpPr: GroupShapeProperties

  get elements(): OXML[] { return getElements(this.element.children) }
}
