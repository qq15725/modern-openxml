import type { VNode } from './vnode'
import { pathToContentType, withIndents } from './utils'

const PACKAGE = 'application/vnd.openxmlformats-package'
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
  [`${DOCUMENT}.presentationml.presentation.main+xml`]: 'presentation',
  [`${DOCUMENT}.presentationml.presProps+xml`]: 'presProps',
  [`${DOCUMENT}.presentationml.viewProps+xml`]: 'viewProps',

  [`${DOCUMENT}.wordprocessingml.document.main+xml`]: 'document',
  [`${DOCUMENT}.wordprocessingml.styles+xml`]: 'docxStyles',
  [`${DOCUMENT}.wordprocessingml.settings+xml`]: 'settings',
  [`${DOCUMENT}.wordprocessingml.webSettings+xml`]: 'webSettings',
  [`${DOCUMENT}.wordprocessingml.fontTable+xml`]: 'fontTable',

  [`${DOCUMENT}.spreadsheetml.sharedStrings+xml`]: 'sharedStrings',
  [`${DOCUMENT}.spreadsheetml.styles+xml`]: 'xlsxStyles',
  [`${DOCUMENT}.spreadsheetml.sheet.main+xml`]: 'workbook',
  [`${DOCUMENT}.spreadsheetml.worksheet+xml`]: 'worksheet',
} as const

const _CONTENT_TYPES = [
  // docProps
  [/app\.xml$/, 'app', null],
  [/core\.xml$/, 'core', null],
  [/custom\.xml$/, 'custom', null],
  [/theme\d+\.xml$/, 'theme', null],
  // ppt
  [/presProps\.xml$/, 'presProps', null],
  [/viewProps\.xml$/, 'viewProps', null],
  [/slide\d+\.xml$/, 'slide', null],
  [/slideLayout\d+\.xml$/, 'slideLayout', null],
  [/slideMaster\d+\.xml$/, 'slideMaster', null],
  [/notesSlide\d+\.xml$/, 'notesSlide', null],
  [/notesMaster\d+\.xml$/, 'notesMaster', null],
  [/presentation\.xml$/, 'presentation', null],
  // xl
  [/workbook\.xml$/, 'workbook', null],
  [/styles\.xml$/, 'xlsxStyles', null],
  [/sharedStrings\.xml$/, 'sharedStrings', null],
  [/sheet\d+\.xml$/, 'worksheet', null],
  [/\.rels$/, 'relationship', 'rels'],
  [/\.png$/, 'image/png', 'png'],
  [/\.jpg$/, 'image/jpeg', 'jpg'],
  [/\.jpeg$/, 'image/jpeg', 'jpeg'],
  [/\.wmf$/, 'image/x-wmf', 'wmf'],
] as const

export function pathToContentType(path: string) {
  for (const [RE, contentType, extension] of _CONTENT_TYPES) {
    if (RE.test(path))
      return [contentType, extension]
  }
  return undefined
}

export class ContentTypes {
  static get() {

  }

  static parse(node: VNode): { type: string, ext?: string, path?: string }[] {
    const convertType = (type: string) => CONTENT_TYPES[type] ?? type

    return [
      ...node.get('Types/Default').map((v) => {
        return {
          type: convertType(v.attr('@ContentType')!),
          ext: v.attr('@Extension'),
        }
      }),
      ...node.get('Types/Override').map((v) => {
        return {
          type: convertType(v.attr('@ContentType')!),
          path: v.attr('@PartName'),
        }
      }),
    ]
  }

  static stringify(paths: string[]) {
    const convert = (type: string | undefined) => {
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
          defaults.push(
            `<Default ContentType="${convert(contentType as string)}" Extension="${ext}"/>`,
          )
        }
      }
      else {
        const partName = path.startsWith('/') ? path : `/${path}`
        overrides.push(
          `<Override ContentType="${convert(contentType as string)}" PartName="${partName}"/>`,
        )
      }
    })

    return `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default ContentType="application/xml" Extension="xml"/>
  ${withIndents(defaults)}
  ${withIndents(overrides)}
</Types>`
  }
}
