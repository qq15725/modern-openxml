import type { VNode } from '../vnode'
import { defineElement, OOXML } from '../../core'
import { Pixel, withAttr, withAttrs, withIndents } from '../utils'

/**
 * https://learn.microsoft.com/dotnet/api/documentformat.openxml.spreadsheet.workbook
 */
@defineElement('x:workbook')
export class Workbook extends OOXML {
  parse(node: VNode) {
    return {
      width: Pixel.decode(node.attr('workbook/bookViews/workbookView/@windowWidth'), 'dxa'),
      height: Pixel.decode(node.attr('workbook/bookViews/workbookView/@windowHeight'), 'dxa'),
      activeTab: node.attr('workbook/bookViews/workbookView/@activeTab'),
      sheets: node.get('workbook/sheets/sheet').map((sheet) => {
        return {
          name: sheet.attr('@name'),
          rid: sheet.attr('@r:id'),
        }
      }),
    }
  }

  override toXmlString(): string {
    const sheets = props.sheets.map((sheet, index) => {
      return `<sheet${withAttrs([
        withAttr('name', sheet.name),
        withAttr('sheetId', index + 1),
        withAttr('r:id', `rId${index + 1}`),
      ])}/>`
    })

    return `<workbook
  xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
>
  <fileVersion appName="xl" lastEdited="3" lowestEdited="5" rupBuild="9302"/>
  <workbookPr/>
  <bookViews>
    <workbookView${withAttrs([
      withAttr('windowWidth', Pixel.encode(props.width ?? 1875, 'dxa')),
      withAttr('windowHeight', Pixel.encode(props.height ?? 836, 'dxa')),
      withAttr('activeTab', props.activeTab ?? 1),
    ])}/>
  </bookViews>
  <sheets>
    ${withIndents(sheets, 2)}
  </sheets>
  <calcPr calcId="144525"/>
</workbook>`
  }
}
