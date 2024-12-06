import type { ColorMapOverride } from './ColorMapOverride'
import { defineChild, defineElement, defineProperty, OXML } from '../../core'
import { _Slide } from './_Slide'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.presentation.slide
 */
@defineElement('p:sld')
export class Slide extends _Slide {
  attrs = {
    'xmlns': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'xmlns:a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'xmlns:p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'xmlns:r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
  }

  @defineChild('p:clrMapOvr') declare clrMapOvr: ColorMapOverride

  @defineProperty() type = 'slide'
  @defineProperty() style = new _SlideStyle(this)
}

export class _SlideStyle extends OXML {
  @defineProperty('_backgroundColor') declare backgroundColor?: string
  @defineProperty('_backgroundImage') declare backgroundImage?: string

  protected get _backgroundColor(): string | undefined {
    return this._parent.cSld.bg?.bgPr.fillColor
  }

  protected get _backgroundImage(): string | undefined {
    return this._parent.cSld.bg?.bgPr.fillImage
  }

  constructor(
    protected _parent: Slide,
  ) {
    super()
  }
}
