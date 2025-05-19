import type { Unzipped } from 'fflate'
import type {
  PPTX,
  PPTXDeclaration,
  Slide,
  SlideElement,
} from '../ooxml'
import { zipSync } from 'fflate'
import {
  compressXml,
  hashBlob,
  IN_BROWSER,
  MINES_TO_EXT,
  stringifyCoreProperties,
  stringifyPresentation,
  stringifyPresentationProperties,
  stringifyProperties,
  stringifyRelationships,
  stringifySlide,
  stringifySlideLayout,
  stringifySlideMaster,
  stringifyTableStyles,
  stringifyTheme,
  stringifyTypes,
  stringifyViewProperties,
  SUPPORTS_CRYPTO_SUBTLE,
  withXmlHeader,
} from '../ooxml'

export class IDocToPPTXConverter {
  async encode(pptx: PPTX): Promise<Uint8Array> {
    const _pptx = { ...pptx } as PPTXDeclaration

    const unzipped: Unzipped = {}
    const add = (path: string, content: string): void => {
      unzipped[path] = new TextEncoder().encode(withXmlHeader(compressXml(content)))
    }
    const cache = new Map<any, string>()
    const addMedia = async (file: any, refs: string[], fileName: string, fileExt: string): Promise<void> => {
      let src = file.src

      if (typeof src === 'string') {
        if (src.startsWith('http')) {
          // network
        }
        else {
          const base64 = src.split(',')?.[1] ?? src
          const binaryString = atob(base64)
          const length = binaryString.length
          const bytes = new Uint8Array(length)
          for (let i = 0; i < length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
          }
          src = bytes
        }
      }

      let cacheKey: string | undefined
      if (SUPPORTS_CRYPTO_SUBTLE && src instanceof Blob) {
        cacheKey = await hashBlob(src)
      }
      else if (typeof file.src === 'string') {
        cacheKey = file.src
      }

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
        unzipped[`ppt/media/${name}`] = typeof src === 'string'
          ? new TextEncoder().encode(src)
          : src
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
    add('docProps/core.xml', stringifyCoreProperties(_pptx.meta))
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
}
