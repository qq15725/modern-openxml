import type { IDOCDocumentDeclaration } from 'modern-idoc'
import type { Theme } from './drawing'
import type { Slide, SlideLayout, SlideMaster } from './presentation'

export interface DecodedPPTXMeta {
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
  meta: DecodedPPTXMeta
}

export interface IDOCPPTX {
  style?: Partial<IDOCPPTXStyle>
  children?: Slide[]
  meta?: Partial<DecodedPPTXMeta>
}
