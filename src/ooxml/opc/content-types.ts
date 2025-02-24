import type { OOXMLNode } from '../core'
import { pathToContentType, withIndents } from '../utils'

const PACKAGE = 'application/vnd.openxmlformats-package'
const MSOFFICE = 'application/vnd.ms-office'
const DOCUMENT = 'application/vnd.openxmlformats-officedocument'
const CONTENT_TYPES = {
  [`${PACKAGE}.relationships+xml`]: 'relationship',
  [`${PACKAGE}.core-properties+xml`]: 'core',
  [`${DOCUMENT}.extended-properties+xml`]: 'app',
  [`${DOCUMENT}.custom-properties+xml`]: 'custom',
  [`${DOCUMENT}.theme+xml`]: 'theme',

  [`${DOCUMENT}.presentationml.notesSlide+xml`]: 'notesSlide',
  [`${DOCUMENT}.presentationml.notesMaster+xml`]: 'notesMaster',
  [`${DOCUMENT}.presentationml.slideLayout+xml`]: 'slideLayout',
  [`${DOCUMENT}.presentationml.slideMaster+xml`]: 'slideMaster',
  [`${DOCUMENT}.presentationml.slide+xml`]: 'slide',
  [`${DOCUMENT}.drawingml.diagramColors+xml`]: 'diagramColors',
  [`${DOCUMENT}.drawingml.diagramData+xml`]: 'diagramData',
  [`${DOCUMENT}.drawingml.diagramLayout+xml`]: 'diagramLayout',
  [`${DOCUMENT}.drawingml.diagramStyle+xml`]: 'diagramStyle',
  [`${MSOFFICE}.drawingml.diagramDrawing+xml`]: 'diagramDrawing',
  [`${DOCUMENT}.presentationml.presentation.main+xml`]: 'presentation',
  [`${DOCUMENT}.presentationml.presProps+xml`]: 'presProps',
  [`${DOCUMENT}.presentationml.tableStyles+xml`]: 'tableStyles',
  [`${DOCUMENT}.presentationml.viewProps+xml`]: 'viewProps',

  [`${DOCUMENT}.wordprocessingml.document.main+xml`]: 'document',
  [`${DOCUMENT}.wordprocessingml.styles+xml`]: 'docxStyles',
  [`${DOCUMENT}.wordprocessingml.settings+xml`]: 'settings',
  [`${DOCUMENT}.wordprocessingml.webSettings+xml`]: 'webSettings',
  [`${DOCUMENT}.wordprocessingml.fontTable+xml`]: 'fontTable',

  [`${DOCUMENT}.spreadsheetml.sharedStrings+xml`]: 'sharedStrings',
  [`${DOCUMENT}.spreadsheetml.styles+xml`]: 'xlsxStyles',
  [`${DOCUMENT}.spreadsheetml.sheet.main+xml`]: 'workbook',
  [`${DOCUMENT}.spreadsheetml.worksheet+xml`]: 'worksheets',
} as const

export function parseTypes(node: OOXMLNode): { type: string, ext?: string, path?: string }[] {
  const convertType = (type: string): string => (CONTENT_TYPES as any)[type] ?? type

  return [
    ...node.get('//Default').map((v) => {
      return {
        type: convertType(v.attr('@ContentType')!),
        ext: v.attr('@Extension'),
      }
    }),
    ...node.get('//Override').map((v) => {
      return {
        type: convertType(v.attr('@ContentType')!),
        path: v.attr('@PartName'),
      }
    }),
  ]
}

export function stringifyTypes(paths: string[]): string {
  const convert = (type: string | undefined): string | undefined => {
    if (type === undefined)
      return undefined
    for (const [key, value] of Object.entries(CONTENT_TYPES)) {
      if (type === value)
        return key
    }
    return type
  }

  const defaults: string[] = []
  const overrides: string[] = []
  const extSet = new Set()

  paths.forEach((path) => {
    const res = pathToContentType(path)
    if (!res)
      return
    const [contentType, ext] = res
    if (ext) {
      if (!extSet.has(ext)) {
        extSet.add(ext)
        defaults.push(`<Default Extension="${ext}" ContentType="${convert(contentType as string)}"/>`)
      }
    }
    else {
      const partName = path.startsWith('/') ? path : `/${path}`
      overrides.push(`<Override PartName="${partName}" ContentType="${convert(contentType as string)}"/>`)
    }
  })

  return `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  ${withIndents(defaults)}
  <Default Extension="xml" ContentType="application/xml"/>
  ${withIndents(overrides)}
</Types>`
}
