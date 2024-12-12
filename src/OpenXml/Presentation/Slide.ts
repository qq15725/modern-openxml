import type { ColorMapOverride } from './ColorMapOverride'
import { defineChild, defineElement, defineProperty, OOXML } from '../../core'
import { _Slide } from './_Slide'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slide
 */
@defineElement('p:sld')
export class Slide extends _Slide {
  path?: string
  layoutPath?: string

  attrs = {
    'xmlns': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'xmlns:a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'xmlns:p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'xmlns:r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
  }

  @defineChild('p:clrMapOvr') declare clrMapOvr: ColorMapOverride

  @defineProperty() type = 'slide'
  @defineProperty() style = new _SlideStyle(this)
  @defineProperty() layoutIndex = -1
}

export class _SlideStyle extends OOXML {
  @defineProperty('_backgroundColor') declare backgroundColor?: string
  @defineProperty('_backgroundImage') declare backgroundImage?: string

  protected get _backgroundColor(): string | undefined {
    return this._parent.cSld.bg?.bgPr.getFill().color
  }

  protected get _backgroundImage(): string | undefined {
    return this._parent.cSld.bg?.bgPr.getFill().image
  }

  constructor(
    protected _parent: Slide,
  ) {
    super()
  }
}
