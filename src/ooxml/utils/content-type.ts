const CONTENT_TYPES = [
  [/docProps\/app\.xml$/, 'app', null],
  [/docProps\/core\.xml$/, 'core', null],
  [/tableStyles\.xml$/, 'tableStyles', null],
  [/presProps\.xml$/, 'presProps', null],
  [/viewProps\.xml$/, 'viewProps', null],
  [/theme\d+\.xml$/, 'theme', null],
  [/slide\d+\.xml$/, 'slide', null],
  [/colors\d+\.xml$/, 'diagramColor', null],
  [/data\d+\.xml$/, 'diagramData', null],
  [/layout\d+\.xml$/, 'diagramLayout', null],
  [/quickStyle\d+\.xml$/, 'diagramStyle', null],
  [/drawing\d+\.xml$/, 'diagramDrawing', null],
  [/slideLayout\d+\.xml$/, 'slideLayout', null],
  [/slideMaster\d+\.xml$/, 'slideMaster', null],
  [/notesSlide\d+\.xml$/, 'notesSlide', null],
  [/notesMaster\d+\.xml$/, 'notesMaster', null],
  [/presentation\.xml$/, 'presentation', null],

  [/\.rels$/, 'relationship', 'rels'],

  [/\.svg$/i, 'image/svg+xml', 'svg'],
  [/\.gif$/i, 'image/gif', 'gif'],
  [/\.png$/i, 'image/png', 'png'],
  [/\.jpg$/i, 'image/jpeg', 'jpg'],
  [/\.jpeg$/i, 'image/jpeg', 'jpeg'],
  [/\.wmf$/i, 'image/x-wmf', 'wmf'],

  [/\.mp4$/i, 'video/mp4', 'mp4'],
  [/\.mp3$/i, 'audio/mpeg', 'mp3'],

  [/\.fntdata$/i, 'font', 'fntdata'],
] as const

export function pathToContentType(path: string): [string, string | null] | undefined {
  for (const [RE, contentType, extension] of CONTENT_TYPES) {
    if (RE.test(path))
      return [contentType, extension]
  }
  return undefined
}
