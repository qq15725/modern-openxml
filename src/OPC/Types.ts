import type { Default } from './Default'
import type { Override } from './Override'
import { defineChildren, defineElement, OXML } from '../core'

const _package = 'application/vnd.openxmlformats-package'
const officedocument = 'application/vnd.openxmlformats-officedocument'
const presentationml = `${officedocument}/presentationml`
const wordprocessingml = `${officedocument}/wordprocessingml`
const spreadsheetml = `${officedocument}/spreadsheetml`

@defineElement('Types')
export class Types extends OXML {
  attrs = {
    xmlns: 'http://schemas.openxmlformats.org/package/2006/content-types',
  }

  static package = _package
  static officedocument = officedocument
  static presentationml = presentationml
  static wordprocessingml = wordprocessingml
  static spreadsheetml = spreadsheetml
  static map = {
    relationship: `${_package}.relationships+xml`,
    core: `${_package}.core-properties+xml`,
    app: `${officedocument}.extended-properties+xml`,
    custom: `${officedocument}.custom-properties+xml`,
    theme: `${officedocument}.theme+xml`,
    notesSlide: `${presentationml}.notesSlide+xml`,
    notesMaster: `${presentationml}.notesMaster+xml`,
    slideLayout: `${presentationml}.slideLayout+xml`,
    slideMaster: `${presentationml}.slideMaster+xml`,
    slide: `${presentationml}.slide+xml`,
    presentation: `${presentationml}.presentation.main+xml`,
    presProps: `${presentationml}.presProps+xml`,
    viewProps: `${presentationml}.viewProps+xml`,
    document: `${wordprocessingml}.document.main+xml`,
    docxStyles: `${wordprocessingml}.styles+xml`,
    settings: `${wordprocessingml}.settings+xml`,
    webSettings: `${wordprocessingml}.webSettings+xml`,
    fontTable: `${wordprocessingml}.fontTable+xml`,
    sharedStrings: `${spreadsheetml}.sharedStrings+xml`,
    xlsxStyles: `${spreadsheetml}.styles+xml`,
    workbook: `${spreadsheetml}.sheet.main+xml`,
    worksheet: `${spreadsheetml}.worksheet+xml`,
  } as const

  @defineChildren('Default') declare defaultList: Default[]
  @defineChildren('Override') declare overrideList: Override[]

  get value(): Record<string, string> {
    return {
      ...Object.fromEntries(this.defaultList.map(v => [v.extension, v.contentType])),
      ...Object.fromEntries(this.overrideList.map(v => [v.partName, v.contentType])),
    }
  }

  getPartName(contentType: string, trim = true): string | undefined {
    if (!contentType.startsWith(Types.officedocument)) {
      contentType = `${Types.officedocument}.${contentType}`
    }
    let partName = this.overrideList.find(v => v.contentType === contentType)?.partName
    if (partName && trim) {
      partName = partName.replace(/^\//, '')
    }
    return partName
  }
}
