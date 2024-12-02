import type { XmlObject } from '../../core'
import { defineChild } from '../../core'
import { _Namespace } from './_Namespace'
import { ColorMapOverride } from './ColorMapOverride'
import { CommonSlideData } from './CommonSlideData'
import { GroupShape } from './GroupShape'
import { Picture } from './Picture'
import { Shape } from './Shape'
import { Timing } from './Timing'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slide
 */
export class Slide extends _Namespace {
  readonly tag = 'sld'

  attrs = {
    'xmlns': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'xmlns:a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'xmlns:p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'xmlns:r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
  }

  @defineChild('p:cSld', CommonSlideData) declare cSld: CommonSlideData
  @defineChild('p:clrMapOvr', ColorMapOverride) declare clrMapOvr: ColorMapOverride
  @defineChild('p:timing', Timing) declare timing: Timing

  get id(): string { return this.cSld.spTree.nvGrpSpPr.cNvPr.id }
  get name(): string { return this.cSld.spTree.nvGrpSpPr.cNvPr.name }
  get elements(): XmlObject[] {
    const elements: XmlObject[] = []
    this.cSld.spTree.node.childNodes.forEach((node) => {
      switch (node.nodeName) {
        case 'p:nvGrpSpPr':
        case 'p:grpSpPr':
          // skip
          break
        case 'p:sp':
          elements.push(new Shape().parse(node as HTMLElement))
          break
        case 'p:pic':
          elements.push(new Picture().parse(node as HTMLElement))
          break
        case 'p:grpSp':
          elements.push(new GroupShape().parse(node as HTMLElement))
          break
        case 'dsp:sp':
        case 'p:cxnSp':
        case 'p:graphicFrame':
        default:
          console.warn(node)
          break
      }
    })
    return elements
  }
}
