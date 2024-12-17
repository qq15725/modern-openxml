import type { Theme } from '../Drawing'
import type { CommonSlideData } from './CommonSlideData'
import type { ConnectionShape, ConnectionShapeJSON } from './ConnectionShape'
import type { ExtensionList } from './ExtensionList'
import type { GraphicFrame, GraphicFrameJSON } from './GraphicFrame'
import type { GroupShape, GroupShapeJSON } from './GroupShape'
import type { Picture, PictureJSON } from './Picture'
import type { PlaceholderShape } from './PlaceholderShape'
import type { Presentation } from './Presentation'
import type { Shape, ShapeJSON } from './Shape'
import type { SlideLayout } from './SlideLayout'
import type { SlideMaster } from './SlideMaster'
import type { Timing } from './Timing'
import { defineChild, defineProperty, OOXML } from '../../core'

export interface SlideContext {
  theme?: Theme
  layout?: SlideLayout
  master?: SlideMaster
  presentation?: Presentation
}

export type SlideElement =
  | Shape
  | GroupShape
  | Picture
  | ConnectionShape
  | GraphicFrame

export type SlideElementJSON =
  | ShapeJSON
  | GroupShapeJSON
  | PictureJSON
  | ConnectionShapeJSON
  | GraphicFrameJSON

export class _Slide extends OOXML {
  @defineChild('p:cSld') declare cSld: CommonSlideData
  @defineChild('p:extLst') declare extLst: ExtensionList
  @defineChild('p:timing') declare timing: Timing
  @defineChild('p:transition') declare transition: OOXML
  @defineChild('mc:AlternateContent') declare AlternateContent: OOXML

  @defineProperty('cSld.name') declare name?: string
  @defineProperty('_elements') declare elements: SlideElement[]

  get _elements(): SlideElement[] {
    return Array.from(this.cSld.spTree.element.children)
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

  findPh(ph: PlaceholderShape): SlideElement | undefined {
    return this.elements?.find(el => ph.isEqual(el))
  }
}
