import type { IDOCDocumentDeclaration } from 'modern-idoc'
import type { Theme } from './drawing'
import type { Slide, SlideLayout, SlideMaster } from './presentation'

export type IDOCPPTXSource =
  | string
  | number[]
  | Uint8Array
  | ArrayBuffer
  | Blob
  | NodeJS.ReadableStream

export interface IDOCPPTXMeta {
  cover?: string
  themes: Theme[]
  slideLayouts: SlideLayout[]
  slideMasters: SlideMaster[]
}

export interface IDOCPPTXStyle {
  width: number
  height: number
}

export interface IDOCPPTXDeclaration extends IDOCDocumentDeclaration {
  style: IDOCPPTXStyle
  children: Slide[]
  meta: IDOCPPTXMeta
}

export interface IDOCPPTX {
  style?: Partial<IDOCPPTXStyle>
  children?: Slide[]
  meta?: Partial<IDOCPPTXMeta>
}
