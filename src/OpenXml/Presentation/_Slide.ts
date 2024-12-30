import type { PresetShapeDefinitions, Theme } from '../Drawing'
import type { CommonSlideData } from './CommonSlideData'
import type { ConnectionShape, IDOCConnectionShapeElement } from './ConnectionShape'
import type { ExtensionList } from './ExtensionList'
import type { GraphicFrame, IDOCGraphicFrameElement } from './GraphicFrame'
import type { GroupShape, IDOCGroupShapeElement } from './GroupShape'
import type { IDOCPictureElement, Picture } from './Picture'
import type { PlaceholderShape } from './PlaceholderShape'
import type { Presentation } from './Presentation'
import type { IDOCShapeElement, Shape } from './Shape'
import type { SlideLayout } from './SlideLayout'
import type { SlideMaster } from './SlideMaster'
import type { Timing } from './Timing'
import { defineChild, defineProperty, OOXML } from '../../core'

export interface SlideContext {
  presetShapeDefinitions?: PresetShapeDefinitions
  presentation?: Presentation
  layout?: SlideLayout
  master?: SlideMaster
  theme?: Theme
}

export type SlideElement =
  | Shape
  | GroupShape
  | Picture
  | ConnectionShape
  | GraphicFrame

export type IDOCSlideChildElement =
  | IDOCShapeElement
  | IDOCGroupShapeElement
  | IDOCPictureElement
  | IDOCConnectionShapeElement
  | IDOCGraphicFrameElement

export abstract class _Slide extends OOXML {
  @defineChild('p:cSld', { required: true }) declare cSld: CommonSlideData
  @defineChild('p:extLst') declare extLst?: ExtensionList
  @defineChild('p:timing') declare timing?: Timing
  @defineChild('p:transition') declare transition?: OOXML
  @defineChild('mc:AlternateContent') declare AlternateContent?: OOXML

  @defineProperty('cSld.name') declare name?: string

  get elements(): SlideElement[] {
    return this.cSld.spTree.children
      .filter((element) => {
        switch (element.tag) {
          case 'sp':
          case 'grpSp':
          case 'cxnSp':
          case 'pic':
          case 'graphicFrame':
            return true
          case 'nvGrpSpPr':
          case 'grpSpPr':
          default:
            return false
        }
      }) as SlideElement[]
  }

  findPh(ph: PlaceholderShape): SlideElement | undefined {
    return this.elements?.find(el => ph.isEqual(el))
  }
}
