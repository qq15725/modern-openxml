import type { ColorMapOverride } from './ColorMapOverride'
import type { CommonSlideData } from './CommonSlideData'
import type { Timing } from './Timing'
import { defineChild, defineElement, defineProperty, OXML } from '../../core'
import { getElements } from './_utils'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slide
 */
@defineElement('sld', 'p')
export class Slide extends OXML {
  attrs = {
    'xmlns': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'xmlns:a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'xmlns:p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'xmlns:r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
  }

  @defineChild('cSld') declare cSld: CommonSlideData
  @defineChild('clrMapOvr') declare clrMapOvr: ColorMapOverride
  @defineChild('timing') declare timing: Timing

  @defineProperty('cSld.spTree.nvGrpSpPr.cNvPr.id') declare id: string
  @defineProperty('cSld.spTree.nvGrpSpPr.cNvPr.name') declare name: string
  @defineProperty({
    get() {
      return getElements(this.cSld.spTree.element.children)
    },
  })
  declare elements: OXML[]
}
