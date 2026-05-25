import type { NormalizedDocument } from 'modern-idoc'
import { unzipSync } from 'fflate'
import { describe, expect, it } from 'vitest'
import { docToDocx, docToXlsx } from '../src'

function read(zip: Uint8Array, path: string): string {
  const file = unzipSync(zip)[path]
  if (!file) {
    throw new Error(`missing ${path}`)
  }
  return new TextDecoder().decode(file)
}

// 一段加粗文本 + 一个 2 行 2 列、首行横向合并的表格(纯 idoc,无 meta)
function makeIdocDoc(): NormalizedDocument {
  return {
    id: 'doc',
    children: [
      {
        id: 'p',
        text: { enabled: true, content: [{ fragments: [{ content: 'Hello', fontWeight: 700 }] }] },
      },
      {
        id: 't',
        table: {
          enabled: true,
          columns: [{ width: 120 }, { width: 120 }],
          rows: [{ height: 24 }, { height: 24 }],
          cells: [
            { row: 0, col: 0, colSpan: 2, children: [{ id: 'h', text: { enabled: true, content: [{ fragments: [{ content: 'Header' }] }] } }] },
            { row: 1, col: 0, children: [{ id: 'a', text: { enabled: true, content: [{ fragments: [{ content: 'A2' }] }] } }] },
            { row: 1, col: 1, children: [{ id: 'b', text: { enabled: true, content: [{ fragments: [{ content: 'B2' }] }] } }] },
          ],
        },
      },
    ],
  } as unknown as NormalizedDocument
}

describe('docToDocx fallback (no meta.docx)', () => {
  it('rebuilds a docx from the idoc model instead of throwing', async () => {
    const docx = await docToDocx(makeIdocDoc())
    const document = read(docx, 'word/document.xml')
    // 文本与加粗
    expect(document).toContain('Hello')
    expect(document).toContain('<w:b/>')
    // 表格与横向合并(gridSpan)
    expect(document).toContain('<w:tbl>')
    expect(document).toContain('<w:gridSpan w:val="2"/>')
    expect(document).toContain('Header')
    expect(document).toContain('A2')
    expect(document).toContain('B2')
  })

  it('prefers meta.docx for lossless round-trip when present', async () => {
    const doc = {
      id: 'doc',
      children: [{ id: 'p', text: { enabled: true, content: [{ fragments: [{ content: 'FromIdoc' }] }] } }],
      meta: { docx: { blocks: [{ runs: [{ text: 'FromMeta' }] }] } },
    } as unknown as NormalizedDocument
    const document = read(await docToDocx(doc), 'word/document.xml')
    expect(document).toContain('FromMeta')
    expect(document).not.toContain('FromIdoc')
  })
})

describe('docToXlsx fallback (no meta.workbook)', () => {
  it('rebuilds an xlsx grid from the idoc model instead of throwing', async () => {
    const doc = {
      id: 'doc',
      children: [
        {
          id: 's',
          meta: { name: 'MySheet' },
          table: {
            enabled: true,
            columns: [{ width: 64 }, { width: 64 }],
            rows: [{ height: 20 }, { height: 20 }],
            cells: [
              { row: 0, col: 0, children: [{ id: 'a', text: { enabled: true, content: [{ fragments: [{ content: 'Name' }] }] } }] },
              { row: 0, col: 1, children: [{ id: 'b', text: { enabled: true, content: [{ fragments: [{ content: 'Age' }] }] } }] },
              { row: 1, col: 0, children: [{ id: 'c', text: { enabled: true, content: [{ fragments: [{ content: 'Bob' }] }] } }] },
              { row: 1, col: 1, children: [{ id: 'd', text: { enabled: true, content: [{ fragments: [{ content: '42' }] }] } }] },
            ],
          },
        },
      ],
    } as unknown as NormalizedDocument

    const xlsx = await docToXlsx(doc)
    const sheet = read(xlsx, 'xl/worksheets/sheet1.xml')
    const shared = read(xlsx, 'xl/sharedStrings.xml')
    const workbook = read(xlsx, 'xl/workbook.xml')

    // 表名
    expect(workbook).toContain('MySheet')
    // 字符串走共享字符串池,数值直接内联
    expect(shared).toContain('Name')
    expect(shared).toContain('Bob')
    expect(sheet).toContain('<v>42</v>') // "42" 被推断为数值
    // 单元格引用网格
    expect(sheet).toContain('r="A1"')
    expect(sheet).toContain('r="B2"')
  })

  it('prefers meta.workbook for lossless round-trip when present', async () => {
    const doc = {
      id: 'doc',
      children: [],
      meta: { workbook: { sheets: [{ name: 'Kept', rows: [] }] } },
    } as unknown as NormalizedDocument
    const workbook = read(await docToXlsx(doc), 'xl/workbook.xml')
    expect(workbook).toContain('Kept')
  })
})
