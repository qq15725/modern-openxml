import type { SlideElement } from './_Slide'
import { defineAttribute, defineElement, defineProperty, OOXML } from '../../core'
import { ConnectionShape } from './ConnectionShape'
import { GraphicFrame } from './GraphicFrame'
import { GroupShape } from './GroupShape'
import { Picture } from './Picture'
import { Shape } from './Shape'

export interface IDOCPlaceholderShape {
  type?: string
  index?: string
}

/**
 * @link https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.placeholdershape
 */
@defineElement('p:ph')
export class PlaceholderShape extends OOXML {
  @defineAttribute('type', { isProperty: true }) declare type?: string
  @defineAttribute('idx') declare idx?: string

  @defineProperty('idx') declare index?: string

  isEqual(element: SlideElement): boolean {
    let ph
    if (element instanceof Shape) {
      ph = element.nvSpPr?.nvPr?.ph
    }
    else if (element instanceof GroupShape) {
      ph = element.nvGrpSpPr?.nvPr?.ph
    }
    else if (element instanceof Picture) {
      ph = element.nvPicPr?.nvPr?.ph
    }
    else if (element instanceof ConnectionShape) {
      ph = element.nvCxnSpPr?.nvPr?.ph
    }
    else if (element instanceof GraphicFrame) {
      ph = element.nvGraphicFramePr?.nvPr?.ph
    }
    if (ph) {
      return ph.type === this.type && ph.idx === this.idx
    }
    return false
  }

  override toIDOC(): IDOCPlaceholderShape {
    return super.toIDOC()
  }
}
