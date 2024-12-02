import { defineChild, defineNode, XmlObject } from '../../core'
import { Default } from './Default'
import { Override } from './Override'

@defineNode('Types')
export class Types extends XmlObject {
  static package = 'application/vnd.openxmlformats-package'
  static officedocument = 'application/vnd.openxmlformats-officedocument'
  static presentationml = `${this.officedocument}/presentationml`
  static wordprocessingml = `${this.officedocument}/wordprocessingml`
  static spreadsheetml = `${this.officedocument}/spreadsheetml`
  static map = {
    relationship: `${this.package}.relationships+xml`,
    core: `${this.package}.core-properties+xml`,
    app: `${this.officedocument}.extended-properties+xml`,
    custom: `${this.officedocument}.custom-properties+xml`,
    theme: `${this.officedocument}.theme+xml`,
    notesSlide: `${this.presentationml}.notesSlide+xml`,
    notesMaster: `${this.presentationml}.notesMaster+xml`,
    slideLayout: `${this.presentationml}.slideLayout+xml`,
    slideMaster: `${this.presentationml}.slideMaster+xml`,
    slide: `${this.presentationml}.slide+xml`,
    presentation: `${this.presentationml}.presentation.main+xml`,
    presProps: `${this.presentationml}.presProps+xml`,
    viewProps: `${this.presentationml}.viewProps+xml`,
    document: `${this.wordprocessingml}.document.main+xml`,
    docxStyles: `${this.wordprocessingml}.styles+xml`,
    settings: `${this.wordprocessingml}.settings+xml`,
    webSettings: `${this.wordprocessingml}.webSettings+xml`,
    fontTable: `${this.wordprocessingml}.fontTable+xml`,
    sharedStrings: `${this.spreadsheetml}.sharedStrings+xml`,
    xlsxStyles: `${this.spreadsheetml}.styles+xml`,
    workbook: `${this.spreadsheetml}.sheet.main+xml`,
    worksheet: `${this.spreadsheetml}.worksheet+xml`,
  } as const

  attrs = {
    xmlns: 'http://schemas.openxmlformats.org/package/2006/content-types',
  }

  @defineChild('Default', Default, true) declare defaultList: Default[]
  @defineChild('Override', Override, true) declare overrideList: Override[]

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
