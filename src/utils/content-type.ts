const CONTENT_TYPES = [
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
  for (const [RE, contentType, extension] of CONTENT_TYPES) {
    if (RE.test(path)) return [contentType, extension]
  }
  return undefined
}
