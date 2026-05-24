import type { NormalizedDocument } from 'modern-idoc'

export type CellValue = string | number | boolean | null

export type CellType = 'string' | 'number' | 'boolean'

export interface Cell {
  /** A1 风格引用,例如 "A1" */
  ref: string
  /** 行号,1-based(对应 OOXML 的 row@r) */
  row: number
  /** 列号,0-based 数值列(便于计算,A=0) */
  col: number
  /** 单元格值(公式单元格为缓存结果) */
  value: CellValue
  /** 值类型 */
  type: CellType
  /** 公式文本(不含前导 "="),例如 "SUM(A1:A2)" */
  formula?: string
}

export interface Row {
  /** 行号,1-based */
  index: number
  cells: Cell[]
  /** 行高(磅 / point,OOXML row@ht 原值) */
  height?: number
}

/** 列定义(对应 <col min max width>),width 为 OOXML 字符宽度原值 */
export interface Column {
  /** 起始列,1-based(含) */
  min: number
  /** 结束列,1-based(含) */
  max: number
  width: number
}

export interface Worksheet {
  name: string
  rows: Row[]
  /** 列宽定义 */
  columns?: Column[]
  /** 合并区,A1 风格,例如 "A1:B2" */
  merges?: string[]
}

export interface Workbook {
  sheets: Worksheet[]
}

// 与 idoc 桥接:NormalizedXlsx 把表格投影成可视元素树,meta 里保留原始
// Workbook 模型用于无损回写(docToXlsx)。
export interface XlsxMeta {
  /** 原始 Workbook 模型,docToXlsx 据此无损回写 */
  workbook: Workbook
  [key: string]: any
}

export interface NormalizedXlsx extends NormalizedDocument {
  meta: XlsxMeta
}
