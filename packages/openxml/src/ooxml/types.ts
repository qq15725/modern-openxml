import type { NormalizedDocument } from 'modern-idoc'
import type { CoreProperties } from './doc-props'
import type { Theme } from './drawing'
import type { Slide, SlideLayout, SlideMaster } from './presentation'

export type PptxSource
  = | string
    | number[]
    | Uint8Array
    | ArrayBuffer
    | Blob
    | NodeJS.ReadableStream

export interface PptxMeta extends CoreProperties {
  cover?: string
  themes: Theme[]
  slides: Slide[]
  slideLayouts: SlideLayout[]
  slideMasters: SlideMaster[]
}

export interface PptxStyle {
  width: number
  height: number
}

export interface NormalizedPptx extends NormalizedDocument {
  style: PptxStyle
  children: Slide[]
  meta: PptxMeta
}

export interface Pptx {
  style?: Partial<PptxStyle>
  children?: Slide[]
  meta?: Partial<PptxMeta>
}
