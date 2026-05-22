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
