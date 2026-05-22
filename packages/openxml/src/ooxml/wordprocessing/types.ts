import type { NormalizedDocument } from 'modern-idoc'

export interface Run {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  /** 字号(磅 / point;OOXML 中以半磅存储) */
  fontSize?: number
  /** 颜色 hex,例如 "FF0000" */
  color?: string
}

export type ParagraphAlign = 'left' | 'center' | 'right' | 'both' | 'justify' | (string & {})

export interface Paragraph {
  runs: Run[]
  /** 段落样式 id(w:pStyle),例如 "Heading1" */
  style?: string
  /** 对齐(w:jc) */
  align?: ParagraphAlign
}

export interface Docx {
  paragraphs: Paragraph[]
}

// 与 idoc 桥接:NormalizedDocx 是投影到 idoc 的视觉文档,meta 里保留原始
// Docx 模型用于无损回写(docToDocx)。
export interface DocxMeta {
  /** 原始 Docx 模型,docToDocx 据此无损回写 */
  docx: Docx
  [key: string]: any
}

export interface NormalizedDocx extends NormalizedDocument {
  meta: DocxMeta
}
