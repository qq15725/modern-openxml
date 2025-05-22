import type { NormalizedDocument } from 'modern-idoc'
import type { CoreProperties } from './doc-props'
import type { Theme } from './drawing'
import type { Slide, SlideLayout, SlideMaster } from './presentation'

export type PPTXSource =
  | string
  | number[]
  | Uint8Array
  | ArrayBuffer
  | Blob
  | NodeJS.ReadableStream

export interface PPTXMeta extends CoreProperties {
  cover?: string
  themes: Theme[]
  slides: Slide[]
  slideLayouts: SlideLayout[]
  slideMasters: SlideMaster[]
}

export interface PPTXStyle {
  width: number
  height: number
}

export interface NormalizedPPTX extends NormalizedDocument {
  style: PPTXStyle
  children: Slide[]
  meta: PPTXMeta
}

export interface PPTX {
  style?: Partial<PPTXStyle>
  children?: Slide[]
  meta?: Partial<PPTXMeta>
}
