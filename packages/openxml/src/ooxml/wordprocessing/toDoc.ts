import type { NormalizedFragment, NormalizedParagraph, TextAlign } from 'modern-idoc'
import type { Docx, NormalizedDocx, Paragraph, ParagraphAlign, Run } from './types'
import { idGenerator } from 'modern-idoc'

// A4 在 96dpi 下约 794x1123 px,作为默认页面尺寸
const PAGE_WIDTH = 794
const LINE_HEIGHT = 24

function mapAlign(align?: ParagraphAlign): TextAlign | undefined {
  if (!align) {
    return undefined
  }
  if (align === 'both') {
    return 'justify'
  }
  return align as TextAlign
}

function runToFragment(run: Run): NormalizedFragment {
  const fragment: NormalizedFragment = { content: run.text }
  if (run.bold) {
    fragment.fontWeight = 700
  }
  if (run.italic) {
    fragment.fontStyle = 'italic'
  }
  if (run.underline) {
    fragment.textDecoration = 'underline'
  }
  if (run.fontSize !== undefined) {
    fragment.fontSize = run.fontSize
  }
  if (run.color) {
    fragment.color = `#${run.color}`
  }
  return fragment
}

function paragraphToIdoc(paragraph: Paragraph): NormalizedParagraph {
  const normalized: NormalizedParagraph = {
    fragments: (paragraph.runs ?? []).map(runToFragment),
  }
  const textAlign = mapAlign(paragraph.align)
  if (textAlign) {
    normalized.textAlign = textAlign
  }
  return normalized
}

/**
 * 把 Docx 数据模型投影为 idoc 文档(用于统一渲染),并把原始 Docx 模型放进
 * meta.docx 以便 docToDocx 无损回写。
 *
 * docx 的段落/run 与 idoc 的 NormalizedParagraph/NormalizedFragment 高度同构,
 * 整篇正文落到根页面元素的一个 text frame 上。
 */
export function docxModelToDoc(docx: Docx): NormalizedDocx {
  const content = (docx.paragraphs ?? []).map(paragraphToIdoc)
  const height = Math.max(content.length * LINE_HEIGHT, 1123)

  return {
    id: idGenerator(),
    style: { width: PAGE_WIDTH, height },
    children: [
      {
        id: idGenerator(),
        style: { left: 0, top: 0, width: PAGE_WIDTH, height },
        text: { enabled: true, content },
      },
    ],
    meta: { docx },
  }
}
