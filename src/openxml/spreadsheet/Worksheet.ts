import { decodeForMap, encodeForMap, withAttr, withAttrs, withIndents } from '../utils'

// Types
import type { VNode } from '../vnode'
import { defineElement, OXML } from '../../core'

const CellType = {
  map: {
    b: 'boolean',
    d: 'date',
    e: 'error',
    inlineStr: 'inline-string',
    n: 'number',
    s: 'shared-string',
    str: 'string',
  } as const,
  encode(value?: string) {
    return encodeForMap(value, this.map)
  },
  decode(value?: string) {
    return decodeForMap(value, this.map)
  },
}

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.spreadsheet.worksheet
 */
@defineElement('worksheet')
export class Worksheet extends OXML {
  parse(node: VNode, sharedStrings: string[]) {
    return {
      cols: node.get('worksheet/cols/col').map((col) => {
        return {
          min: col.attr('@min'),
          max: col.attr('@max'),
          style: col.attr('@style'),
          customWidth: col.attr('@customWidth'),
          width: col.attr('@width'),
        }
      }),
      rows: node.get('worksheet/sheetData/row').map((row) => {
        return row.get('c').map((cell) => {
          const value = cell.find('v')?.getEl().textContent ?? ''
          switch (CellType.decode(cell.attr('@t'))) {
            case 'boolean':
              return Boolean(value)
            case 'date':
            case 'error':
              return value
            case 'inline-string':
              return cell.find('is/t')?.getEl().textContent ?? ''
            case 'number':
              return Number(value)
            case 'shared-string':
              return sharedStrings[value as keyof typeof sharedStrings]
            case 'string':
              return String(value)
          }
          return value
        })
      }),
    }
  }

  override toXmlString(props: ReturnType<typeof parse>): string {
    const az = [...Array.from({ length: 26 })].map((_, i) => String.fromCharCode(65 + i).toUpperCase())
    const colsLength = props.rows[0]?.length

    const cols = props.cols?.map((col) => {
      return `<col${withAttrs([
        withAttr('min', col.min),
        withAttr('max', col.max),
        withAttr('width', col.width),
        withAttr('style', col.style),
        withAttr('customWidth', col.customWidth),
      ])}/>`
    }) ?? []

    const colsString = cols.length > 0
      ? `<cols>
  ${withIndents(cols, 2)}
</cols>`
      : ''

    const rows = props.rows.map((row, rowIndex) => {
      const cells = row.map((cell, cellIndex) => {
        cell = (cell as string)
          ?.replace('&', '&amp;')
        return `<c${withAttrs([
          withAttr('r', `${az[cellIndex]}${rowIndex + 1}`),
          withAttr('t', CellType.encode('inlineStr')),
        ])}>
  <is>
    <t>${cell}</t>
  </is>
</c>`
      })

      return `<row${withAttrs([
        withAttr('r', rowIndex + 1),
        withAttr('spans', `1:${colsLength || 1}`),
      ])}>
  ${withIndents(cells)}
</row>`
    })

    const rowsString = rows.length > 0
      ? `<sheetData>
  ${withIndents(rows, 2)}
</sheetData>`
      : '<sheetData/>'

    const rowsLength = props.rows.length

    const dimensionRef = [
      'A1',
      rowsLength > 0 ? `${az[colsLength - 1]}${rowsLength}` : undefined,
    ].filter(Boolean).join(':')

    return `<worksheet
  xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing"
  xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main"
  xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
  xmlns:etc="http://www.wps.cn/officeDocument/2017/etCustomData"
>
  <sheetPr/>
  <dimension ref="${dimensionRef}"/>
  <sheetViews>
    <sheetView workbookViewId="0">
      <selection activeCell="A1" sqref="A1"/>
    </sheetView>
  </sheetViews>
  <sheetFormatPr defaultColWidth="9" defaultRowHeight="13.5"/>
  ${colsString}
  ${rowsString}
  <pageMargins left="0.75" right="0.75" top="1" bottom="1" header="0.5" footer="0.5"/>
  <headerFooter/>
</worksheet>`
  }
}
