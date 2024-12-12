import type { ConnectionShape } from './ConnectionShape'
import type { GraphicFrame } from './GraphicFrame'
import type { GroupShapeProperties } from './GroupShapeProperties'
import type { NonVisualGroupShapeProperties } from './NonVisualGroupShapeProperties'
import type { Picture } from './Picture'
import type { Shape } from './Shape'
import { defineChild, defineElement, defineProperty, OOXML } from '../../core'
import { _Element } from './_Element'
import { _GroupShapeComputedStyle } from './_GroupShapeComputedStyle'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.groupshape
 */
@defineElement('p:grpSp')
export class GroupShape extends _Element {
  @defineChild('p:nvGrpSpPr') declare nvGrpSpPr?: NonVisualGroupShapeProperties
  @defineChild('p:grpSpPr') declare grpSpPr: GroupShapeProperties

  @defineProperty() type = 'groupShape'
  @defineProperty('nvSpPr.cNvPr.name') declare name?: string
  @defineProperty() computedStyle = new _GroupShapeComputedStyle(this)
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
