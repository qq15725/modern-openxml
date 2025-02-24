import type { Unzipped } from 'fflate'
import type { ImageDeclaration, StyleProp } from 'modern-idoc'
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

export interface PPTX {
  style: {
    width: number
    height: number
  }
  children: Slide[]
  meta: {
    cover?: ImageDeclaration
    themes: Theme[]
    slideLayouts: SlideLayout[]
    slideMasters: SlideMaster[]
  }
}

export interface PPTXOptions {
  presetShapeDefinitions?: string
}

export interface EncodeingPPTX {
  style?: StyleProp
  children?: Omit<Slide, 'layoutId' | 'masterId'>[]
  meta?: {
    cover?: ImageDeclaration
    themes?: Theme[]
    slideLayouts?: SlideLayout[]
    slideMasters?: SlideMaster[]
  }
}

const resolvePath = (path: string): string => (path.startsWith('/') ? path.substring(1) : path)
const file = (zip: Record<string, any>, path?: string): any | undefined => (path ? zip[resolvePath(path)] : undefined)

export async function decodePPTX(source: Uint8Array, options: PPTXOptions = {}): Promise<PPTX> {
  const unzipped: Unzipped = unzipSync(source)

  const createNode = (xml?: string): OOXMLNode => OOXMLNode.fromXML(xml, namespaces)
  const readNode = async (path?: string): Promise<OOXMLNode> => createNode(new TextDecoder().decode(await file(unzipped, path)))
  const getRelsPath = (path = ''): string => {
    const paths = path.split('/')
    const name = paths.pop()
    return [...paths, '_rels', `${name}.rels`].join('/')
  }

  const presetShapeDefinitions = options.presetShapeDefinitions
    ? createNode(options.presetShapeDefinitions)
    : undefined

  // [Content_Types].xml
  const contentTypes = parseTypes((await readNode('[Content_Types].xml'))!)

  // _rels/.rels
  const relsPath = getRelsPath()
  const relsNode = (await readNode(relsPath))!
  const rels = parseRelationships(relsNode, relsPath, contentTypes)

  // ppt/presentation.xml
  const presentationPath = rels.find(v => v.type === 'presentation')?.path
  const presentationNode = (await readNode(presentationPath))!
  const presentation = parsePresentation(presentationNode)!

  // ppt/_rels/presentation.xml.rels
  const presentationRelsPath = getRelsPath(presentationPath)
  const presentationRels = parseRelationships(
    (await readNode(presentationRelsPath))!,
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
        url: relsNode.attr(
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
    const slideRels = parseRelationships((await readNode(slideRelsPath))!, slideRelsPath, contentTypes)

    // ppt/slideLayouts/_rels/slideX.xml.rels
    const layoutPath = slideRels.find(v => v.type === 'slideLayout')!.path
    const layoutRelsPath = getRelsPath(layoutPath)
    const layoutRels = parseRelationships((await readNode(layoutRelsPath))!, layoutRelsPath, contentTypes)

    // ppt/slideMasters/_rels/slideX.xml.rels
    const masterPath = layoutRels.find(v => v.type === 'slideMaster')!.path
    const masterRelsPath = getRelsPath(masterPath)
    const masterRels = parseRelationships((await readNode(masterRelsPath))!, masterRelsPath, contentTypes)

    // ppt/theme/themeX.xml
    const themePath = masterRels.find(v => v.type === 'theme')?.path

    const themeNode = await readNode(themePath)
    const layoutNode = (await readNode(layoutPath))!
    const masterNode = (await readNode(masterPath))!
    const slideNode = (await readNode(slidePath))!

    const drawingRels = await Promise.all(
      slideRels
        .filter(v => v.type === 'diagramDrawing')
        .map(async (rel) => {
          const relsPath = getRelsPath(rel.path)
          const rels = parseRelationships(await readNode(relsPath), relsPath, contentTypes)
          return {
            ...rel,
            node: (await readNode(rel.path))!,
            rels,
          }
        }),
    )
    const dataRels = await Promise.all(
      slideRels
        .filter(v => v.type === 'diagramData')
        .map(async (rel) => {
          const relsPath = getRelsPath(rel.path)
          const rels = parseRelationships(await readNode(relsPath), relsPath, contentTypes)
          return {
            ...rel,
            node: (await readNode(rel.path))!,
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
  return clearUndef(pptx)
}

export async function encodePPTX(pptx: EncodeingPPTX): Promise<Uint8Array> {
  const unzipped: Unzipped = {}
  const add = (path: string, content: string): void => {
    unzipped[path] = new TextEncoder().encode(withXmlHeader(compressXml(content)))
  }
  const cache = new Map<any, string>()
  const addMedia = async (file: any, refs: string[], fileName: string, fileExt: string): Promise<string> => {
    const cacheKey = SUPPORTS_CRYPTO_SUBTLE && file instanceof Blob
      ? await hashBlob(file)
      : null
    let name: string
    if (cacheKey && cache.has(cacheKey)) {
      name = cache.get(cacheKey)!
    }
    else {
      const ext = IN_BROWSER && file instanceof Blob
        ? MINES_TO_EXT[file.type]
        : fileExt
      name = `${fileName}${cache.size + 1}.${ext}`
      if (cacheKey) {
        cache.set(cacheKey, name)
      }
      else {
        cache.set(name, name)
      }
      unzipped[`ppt/media/${name}`] = file
    }
    refs.push(`../media/${name}`)
    return `rId${refs.length}`
  }

  const stringifyImage = async (file: any, refs: string[]): Promise<any> => addMedia(file, refs, 'image', 'png')
  const stringifyAudio = async (file: any, refs: string[]): Promise<any> => addMedia(file, refs, 'media', 'mp3')

  // slides
  const slides = await Promise.all(
    (pptx.children ?? [])?.map(async (slide) => {
      const slideRefs: string[] = []

      const deepMapElements = <T>(elements: SlideElement[], cb: (el: SlideElement) => T): T[] =>
        elements.flatMap(el => [
          cb(el),
          ...(el.meta.type === 'group-shape' ? deepMapElements((el.children as any), cb) : []),
        ])

      const imageElements = (): any =>
        deepMapElements(slide.children, (el) => {
          return el.image?.url
            && (async () => (el.image!.url = await stringifyImage(el.image!.url, slideRefs)))()
        })

      const audioElements = (): any =>
        deepMapElements(slide.children, (el) => {
          return (
            el.meta.type === 'picture'
            && el.audio
            && (async () => (el.audio = await stringifyAudio((el.audio as any).src, slideRefs)))()
          )
        })

      await Promise.all([
        slide.image?.url
        && (async () => (slide.image!.url = await stringifyImage(slide.image!.url, slideRefs)))(),
        ...imageElements(),
        ...audioElements(),
      ].filter(Boolean))

      return { slide, slideRefs }
    }),
  )

  // presentation
  add(
    'ppt/presentation.xml',
    stringifyPresentation(
      pptx,
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
