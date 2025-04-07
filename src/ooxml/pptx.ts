import type { Unzipped } from 'fflate'
import type { IDOCDocumentDeclaration, StyleProperty, TextureFillDeclaration } from 'modern-idoc'
import type { Theme } from './drawing'
import type {
  Slide,
  SlideElement,
  SlideLayout,
  SlideMaster,
} from './presentation'
import { unzipSync, zipSync } from 'fflate'
import { OOXMLNode } from './core'
import { stringifyCoreProperties, stringifyProperties } from './doc-props'
import { parseTheme, stringifyTheme } from './drawing'
import { namespaces } from './namespaces'
import { parseRelationships, parseTypes, stringifyRelationships, stringifyTypes } from './opc'
import {
  parsePresentation,
  parseSlide,
  parseSlideLayout,
  parseSlideMaster,
  stringifyPresentation,
  stringifyPresentationProperties,
  stringifySlide,
  stringifySlideLayout,
  stringifySlideMaster,
  stringifyTableStyles,
  stringifyViewProperties,
} from './presentation'
import {
  clearUndef,
  compressXml,
  hashBlob,
  IN_BROWSER,
  MINES_TO_EXT,
  SUPPORTS_CRYPTO_SUBTLE,
  withXmlHeader,
} from './utils'

export interface PPTXMeta {
  cover?: TextureFillDeclaration
  themes: Theme[]
  slideLayouts: SlideLayout[]
  slideMasters: SlideMaster[]
}

export interface PPTX extends IDOCDocumentDeclaration {
  style: {
    width: number
    height: number
  }
  children: Slide[]
  meta: PPTXMeta
}

export interface PPTXDecodeOptions {
  presetShapeDefinitions?: string
  upload?: (input: string, file: { src: string }, source: PPTX | Slide | SlideLayout | SlideMaster | SlideElement) => any | Promise<any>
  progress?: (progress: number, total: number, cached: boolean) => void
}

export interface EncodeingPPTX {
  style?: StyleProperty
  children?: Omit<Slide, 'layoutId' | 'masterId'>[]
  meta?: {
    cover?: TextureFillDeclaration
    themes?: Theme[]
    slideLayouts?: SlideLayout[]
    slideMasters?: SlideMaster[]
  }
}

export async function decodePPTX(source: Uint8Array, options: PPTXDecodeOptions = {}): Promise<PPTX> {
  const unzipped: Unzipped = unzipSync(source)

  const createNode = (xml?: string): OOXMLNode => OOXMLNode.fromXML(xml, namespaces)
  const resolvePath = (path: string): string => (path.startsWith('/') ? path.substring(1) : path)
  const readFile = (path?: string, type?: 'text' | 'base64'): any | undefined => {
    const uint8Array = path ? unzipped[resolvePath(path)] : undefined
    if (uint8Array) {
      switch (type) {
        case 'text':
          return new TextDecoder().decode(uint8Array)
        case 'base64':
          // eslint-disable-next-line node/prefer-global/buffer
          if (typeof Buffer !== 'undefined') {
            // eslint-disable-next-line node/prefer-global/buffer
            return Buffer.from(uint8Array).toString('base64')
          }
          else if (typeof btoa !== 'undefined') {
            let binary = ''
            for (let i = 0; i < uint8Array.length; i++) {
              binary += String.fromCharCode(uint8Array[i])
            }
            return btoa(binary)
          }
          else {
            throw new TypeError('Failed readFile to base64')
          }
      }
    }
    return uint8Array
  }
  const readNode = (path?: string): OOXMLNode => createNode(readFile(path, 'text'))
  const getRelsPath = (path = ''): string => {
    const paths = path.split('/')
    const name = paths.pop()
    return [...paths, '_rels', `${name}.rels`].join('/')
  }

  const presetShapeDefinitions = options.presetShapeDefinitions
    ? createNode(options.presetShapeDefinitions)
    : undefined

  // [Content_Types].xml
  const contentTypes = parseTypes(readNode('[Content_Types].xml')!)

  // _rels/.rels
  const relsPath = getRelsPath()
  const relsNode = readNode(relsPath)!
  const rels = parseRelationships(relsNode, relsPath, contentTypes)

  // ppt/presentation.xml
  const presentationPath = rels.find(v => v.type === 'presentation')?.path
  const presentationNode = readNode(presentationPath)!
  const presentation = parsePresentation(presentationNode)!

  // ppt/_rels/presentation.xml.rels
  const presentationRelsPath = getRelsPath(presentationPath)
  const presentationRels = parseRelationships(
    readNode(presentationRelsPath)!,
    presentationRelsPath,
    contentTypes,
  )

  const pptx: PPTX = {
    style: {
      width: presentation.width,
      height: presentation.height,
    },
    children: [],
    meta: {
      themes: [],
      slideLayouts: [],
      slideMasters: [],
      // docProps/thumbnail.jpeg
      cover: {
        src: relsNode.attr(
          'Relationships/Relationship[@Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/thumbnail"]/@Target',
        )!,
      },
    },
  }

  // ppt/slides/slideX.xml
  for (const _slide of presentation.slides) {
    const slideId = _slide.rId
    const slidePath = presentationRels.find(v => v.id === slideId)!.path

    // ppt/slides/_rels/slideX.xml.rels
    const slideRelsPath = getRelsPath(slidePath)
    const slideRels = parseRelationships(readNode(slideRelsPath)!, slideRelsPath, contentTypes)

    // ppt/slideLayouts/_rels/slideX.xml.rels
    const layoutPath = slideRels.find(v => v.type === 'slideLayout')!.path
    const layoutRelsPath = getRelsPath(layoutPath)
    const layoutRels = parseRelationships(readNode(layoutRelsPath)!, layoutRelsPath, contentTypes)

    // ppt/slideMasters/_rels/slideX.xml.rels
    const masterPath = layoutRels.find(v => v.type === 'slideMaster')!.path
    const masterRelsPath = getRelsPath(masterPath)
    const masterRels = parseRelationships(readNode(masterRelsPath)!, masterRelsPath, contentTypes)

    // ppt/theme/themeX.xml
    const themePath = masterRels.find(v => v.type === 'theme')?.path

    const themeNode = readNode(themePath)
    const layoutNode = readNode(layoutPath)!
    const masterNode = readNode(masterPath)!
    const slideNode = readNode(slidePath)!

    const drawingRels = await Promise.all(
      slideRels
        .filter(v => v.type === 'diagramDrawing')
        .map(async (rel) => {
          const relsPath = getRelsPath(rel.path)
          const rels = parseRelationships(readNode(relsPath), relsPath, contentTypes)
          return {
            ...rel,
            node: readNode(rel.path)!,
            rels,
          }
        }),
    )
    const dataRels = await Promise.all(
      slideRels
        .filter(v => v.type === 'diagramData')
        .map(async (rel) => {
          const relsPath = getRelsPath(rel.path)
          const rels = parseRelationships(readNode(relsPath), relsPath, contentTypes)
          return {
            ...rel,
            node: readNode(rel.path)!,
            rels,
          }
        }),
    )

    const theme = parseTheme(themeNode)
    if (themePath && theme) {
      pptx.meta.themes[+themePath.match(/theme(\d+)\.xml$/)![1] - 1] = theme
    }

    const sharedContext = {
      theme: { node: themeNode, ...theme },
      presentation: { node: presentationNode, ...presentation },
      presetShapeDefinitions,
      options,
    }

    const master = parseSlideMaster(masterNode, masterPath, {
      ...sharedContext,
      rels: masterRels,
    })

    const layout = parseSlideLayout(layoutNode, layoutPath, {
      ...sharedContext,
      master: { node: masterNode, ...master },
      rels: layoutRels,
    })

    const slide = parseSlide(slideNode, slidePath, {
      ...sharedContext,
      layout: { node: layoutNode, ...layout },
      master: { node: masterNode, ...master },
      rels: slideRels,
      drawingRels,
      dataRels,
    })

    const masterElements = master?.children.filter(v => !v.meta.placeholderType && !v.meta.placeholderIndex) ?? []
    const layoutElements = layout?.children.filter(v => !v.meta.placeholderType && !v.meta.placeholderIndex) ?? []
    slide.children = masterElements.concat(layoutElements).concat(slide.children)

    pptx.children.push(slide)

    if (pptx.meta.slideLayouts.findIndex(slide => slide.meta.id === layout.meta.id) === -1) {
      pptx.meta.slideLayouts.push(layout)
    }

    if (pptx.meta.slideMasters.findIndex(slide => slide.meta.id === master.meta.id) === -1) {
      pptx.meta.slideMasters.push(master)
    }
  }

  pptx.meta.themes = pptx.meta.themes.filter(Boolean)

  async function _uploadFiles(): Promise<void> {
    const {
      progress,
      upload = (input) => {
        return `data:image/png;base64,${input}`
      },
    } = options
    const cache = new Map<string, Promise<any>>()
    let current = 0

    function flatMapSlide(slide: Slide | SlideLayout | SlideMaster): Promise<any>[] {
      return [
        slide.background?.src && _upload(slide.background!, slide),
        ...slide.children.flatMap(function flatMapEl(el: SlideElement): any[] {
          return [
            el.background?.src && _upload(el.background, el),
            el.foreground?.src && _upload(el.foreground, el),
            el.audio?.src && _upload(el.audio, el),
            el.video?.src && _upload(el.video, el),
            // @ts-expect-error flatMapEl
            ...(el.children?.flatMap(el => flatMapEl(el as any)) ?? []),
          ]
        }),
      ].filter(Boolean)
    }

    const tasks = [
      pptx.meta.cover?.src && _upload(pptx.meta.cover!, pptx),
      ...pptx.children.flatMap(flatMapSlide),
      ...pptx.meta.slideLayouts.flatMap(flatMapSlide),
      ...pptx.meta.slideMasters.flatMap(flatMapSlide),
    ].filter(Boolean) as Promise<any>[]

    async function _upload(file: any, source: PPTX | Slide | SlideLayout | SlideMaster | SlideElement): Promise<void> {
      const key = JSON.stringify({ ...file, width: (source as any).width, height: (source as any).height })
      let promise: Promise<any>
      const cached = cache.has(key)
      if (cached) {
        promise = cache.get(key)!
      }
      else {
        promise = upload?.(readFile(file.src, 'base64'), file as any, source)
        cache.set(key, promise)
      }
      const output = await promise
      progress?.(++current, tasks.length, cached)
      if (output) {
        file.src = output
      }
    }

    await Promise.all(tasks)
  }

  await _uploadFiles()

  return clearUndef(pptx)
}

export async function encodePPTX(pptx: EncodeingPPTX): Promise<Uint8Array> {
  const _pptx = { ...pptx } as PPTX

  const unzipped: Unzipped = {}
  const add = (path: string, content: string): void => {
    unzipped[path] = new TextEncoder().encode(withXmlHeader(compressXml(content)))
  }
  const cache = new Map<any, string>()
  const addMedia = async (file: any, refs: string[], fileName: string, fileExt: string): Promise<void> => {
    const src = file.src
    const cacheKey = SUPPORTS_CRYPTO_SUBTLE && src instanceof Blob
      ? await hashBlob(src)
      : null
    let name: string
    if (cacheKey && cache.has(cacheKey)) {
      name = cache.get(cacheKey)!
    }
    else {
      const ext = IN_BROWSER && src instanceof Blob
        ? MINES_TO_EXT[src.type]
        : fileExt
      name = `${fileName}${cache.size + 1}.${ext}`
      if (cacheKey) {
        cache.set(cacheKey, name)
      }
      else {
        cache.set(name, name)
      }
      unzipped[`ppt/media/${name}`] = src
    }
    refs.push(`../media/${name}`)
    file.src = `rId${refs.length}`
  }

  // slides
  const slides = await Promise.all(
    (pptx.children ?? [])?.map(async (slide) => {
      const slideRefs: string[] = []

      const uploadRefs = <T>(el: Slide | SlideElement): T[] =>
        [
          el.background?.src && addMedia(el.background, slideRefs, 'image', 'png'),
          el.foreground?.src && addMedia(el.foreground, slideRefs, 'image', 'png'),
          el.fill?.src && addMedia(el.fill, slideRefs, 'image', 'png'),
          el.audio?.src && addMedia(el.audio, slideRefs, 'media', 'mp3'),
          el.video?.src && addMedia(el.video, slideRefs, 'media', 'mp4'),
          ...(el.children ?? []).flatMap(el => uploadRefs(el as SlideElement)),
        ].filter(Boolean) as T[]

      await Promise.all(uploadRefs(slide))

      return { slide, slideRefs }
    }),
  )

  // presentation
  add(
    'ppt/presentation.xml',
    stringifyPresentation(
      _pptx,
      slides.map((_, i) => `rId${i + 1}`),
      [`rId${slides.length + 1}`],
    ),
  )

  // slideMaster
  add('ppt/slideMasters/slideMaster1.xml', stringifySlideMaster())
  add('ppt/slideMasters/_rels/slideMaster1.xml.rels', stringifyRelationships([
    '../slideLayouts/slideLayout1.xml',
    '../theme/theme1.xml',
  ]))

  // slides
  const slideXmls = slides.map(({ slide, slideRefs }, index) => {
    const num = index + 1
    add(`ppt/slides/slide${num}.xml`, stringifySlide(slide as any))
    add(`ppt/slides/_rels/slide${num}.xml.rels`, stringifyRelationships([
      ...slideRefs,
      '../slideLayouts/slideLayout1.xml',
    ]))
    return `slides/slide${num}.xml`
  })

  // fonts
  // writeFontData(pptx, zip)

  add('ppt/_rels/presentation.xml.rels', stringifyRelationships([
    ...slideXmls,
    'slideMasters/slideMaster1.xml',
    // ...genFontRels(pptx),
    'theme/theme1.xml',
    'tableStyles.xml',
    'presProps.xml',
    'viewProps.xml',
  ]))

  // props
  add('ppt/presProps.xml', stringifyPresentationProperties())
  add('ppt/viewProps.xml', stringifyViewProperties())

  // theme
  add('ppt/theme/theme1.xml', stringifyTheme())

  // tableStyles
  add('ppt/tableStyles.xml', stringifyTableStyles())

  // slideLayout
  add('ppt/slideLayouts/slideLayout1.xml', stringifySlideLayout())
  add('ppt/slideLayouts/_rels/slideLayout1.xml.rels', stringifyRelationships([
    '../slideMasters/slideMaster1.xml',
  ]))

  // docProps
  add('docProps/core.xml', stringifyCoreProperties())
  add('docProps/app.xml', stringifyProperties(slides.length))

  // rels
  add('_rels/.rels', stringifyRelationships([
    'ppt/presentation.xml',
    'docProps/app.xml',
    'docProps/core.xml',
  ]))

  // contentTypes
  add('[Content_Types].xml', stringifyTypes(Object.keys(unzipped)))

  return zipSync(unzipped)
}
