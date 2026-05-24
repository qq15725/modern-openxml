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

export interface TableCell {
  paragraphs: Paragraph[]
  /** 横向合并列数(w:gridSpan) */
  colSpan?: number
  /** 纵向合并(w:vMerge);restart 为合并起点,continue 为被并入上方 */
  vMerge?: 'restart' | 'continue'
}

export interface TableRow {
  cells: TableCell[]
  /** 行高(twips,w:trHeight 原值) */
  height?: number
}

export interface Table {
  /** 各网格列宽(twips,w:tblGrid/w:gridCol) */
  columns: number[]
  rows: TableRow[]
}

/** 文档正文块:段落或表格(保留出现顺序) */
export type Block = Paragraph | Table

/** 块是否为表格 */
export function isTable(block: Block): block is Table {
  return 'rows' in block
}

export interface Docx {
  blocks: Block[]
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
