import type { Unzipped } from 'fflate'
import type { ImagePipeline, PipelineImage } from 'modern-idoc'
import type {
  NormalizedPptx,
  Pptx,
  Slide,
  SlideElement,
} from '../ooxml'
import { zipSync } from 'fflate'
import { parseDomFromString } from '../global'
import {
  compressXml,
  stringifyChart,
  stringifyCoreProperties,
  stringifyNotesMaster,
  stringifyNotesSlide,
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
  withXmlHeader,
} from '../ooxml'

function parseSvg(dataURI: string): string {
  let xml
  if (dataURI.includes(';base64,')) {
    xml = atob(dataURI.split(',')[1])
  }
  else {
    // ;charset=utf-8,
    xml = decodeURIComponent(dataURI.split(',')[1])
  }
  const svg = parseDomFromString(xml, 'image/svg+xml').documentElement
  const width = svg.getAttribute('width')
  const height = svg.getAttribute('height')
  const isValidWidth = width && /^[\d.]+$/.test(width)
  const isValidHeight = height && /^[\d.]+$/.test(height)
  if (!isValidWidth || !isValidHeight) {
    const viewBox = svg.getAttribute('viewBox')?.split(' ').map(v => Number(v))
    if (!isValidWidth) {
      svg.setAttribute('width', String(viewBox ? viewBox[2] - viewBox[0] : 512))
    }
    if (!isValidHeight) {
      svg.setAttribute('height', String(viewBox ? viewBox[3] - viewBox[1] : 512))
    }
  }
  return svg.outerHTML
}

/**
 * 图片处理管线解析器：给定管线步骤与解码后的图片像素，返回处理后的像素。
 * 由宿主注入（管线的处理函数为运行时黑盒，本库不持有）。返回 undefined 表示放弃处理、沿用原图。
 */
export type ImagePipelineResolver = (
  imagePipelines: ImagePipeline[],
  image: PipelineImage,
) => Promise<PipelineImage | undefined>

export interface DocToPptxOptions {
  /** 图片处理管线解析器（像素级）；带 imagePipelines 的图片经它烘焙后嵌入。 */
  imagePipelineResolver?: ImagePipelineResolver
}

export class DocToPptx {
  constructor(
    protected options: DocToPptxOptions = {},
  ) {}

  /** 把图片地址经管线烘焙成 PNG dataURI（解码像素 → 解析器 → 编码）。 */
  protected async _bakeImagePipelines(
    src: string,
    imagePipelines: ImagePipeline[],
    resolver: ImagePipelineResolver,
  ): Promise<string | undefined> {
    const blob = await fetch(src).then(rep => rep.blob())
    const bitmap = await createImageBitmap(blob)
    const w = Math.max(1, bitmap.width)
    const h = Math.max(1, bitmap.height)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx)
      return undefined
    ctx.drawImage(bitmap, 0, 0)
    bitmap.close?.()
    const imageData = ctx.getImageData(0, 0, w, h)
    const out = await resolver(imagePipelines, { data: imageData.data, width: w, height: h })
    if (!out)
      return undefined
    canvas.width = out.width
    canvas.height = out.height
    const outData = ctx.createImageData(out.width, out.height)
    outData.data.set(out.data)
    ctx.putImageData(outData, 0, 0)
    return canvas.toDataURL('image/png')
  }

  async encode(pptx: Pptx): Promise<Uint8Array> {
    const _pptx = { ...pptx } as NormalizedPptx

    const unzipped: Unzipped = {}
    const add = (path: string, content: string): void => {
      unzipped[path] = new TextEncoder().encode(withXmlHeader(compressXml(content)))
    }
    const cache = new Map<any, string>()
    const addMedia = async (file: any, refs: string[], fileName: string, fileExt: string): Promise<void> => {
      let src = file.image

      // 带图片处理管线时：先经注入的解析器烘焙成 PNG dataURI，后续按 data: 分支嵌入。
      const resolver = this.options.imagePipelineResolver
      if (typeof src === 'string' && file.imagePipelines?.length && resolver) {
        const baked = await this._bakeImagePipelines(src, file.imagePipelines, resolver)
        if (baked) {
          src = baked
          fileExt = 'png'
        }
      }

      let uin8Array: Uint8Array<ArrayBuffer>
      if (typeof src === 'string') {
        if (src.startsWith('data:image/svg+xml;')) {
          fileExt = 'svg'
          uin8Array = new TextEncoder().encode(parseSvg(src))
        }
        else if (src.startsWith('data:')) {
          if (src.includes(';base64,')) {
            const binaryString = atob(src.split(',')?.[1] ?? '')
            const length = binaryString.length
            const bytes = new Uint8Array(length)
            for (let i = 0; i < length; i++) {
              bytes[i] = binaryString.charCodeAt(i)
            }
            uin8Array = bytes
          }
          else {
            return
          }
        }
        else if (
          src.startsWith('http:')
          || src.startsWith('https:')
          || src.startsWith('blob:')
        ) {
          uin8Array = await fetch(src)
            .then(rep => rep.arrayBuffer())
            .then(buffer => new Uint8Array(buffer))
        }
        else {
          uin8Array = new TextEncoder().encode(src)
        }
      }
      else {
        uin8Array = src
      }

      let cacheKey: string | undefined
      if (typeof src === 'string') {
        cacheKey = src
      }

      let name: string
      if (cacheKey && cache.has(cacheKey)) {
        name = cache.get(cacheKey)!
      }
      else {
        name = `${fileName}${cache.size + 1}.${fileExt}`
        if (cacheKey) {
          cache.set(cacheKey, name)
        }
        else {
          cache.set(name, name)
        }
        unzipped[`ppt/media/${name}`] = uin8Array
      }
      refs.push(`../media/${name}`)
      file.image = `rId${refs.length}`
    }

    // slides
    let chartCount = 0
    const slides = await Promise.all(
      (pptx.children ?? [])?.map(async (slide) => {
        const slideRefs: string[] = []

        const uploadRefs = <T>(el: Slide | SlideElement): T[] =>
          [
            el.background?.image && addMedia(el.background, slideRefs, 'image', 'png'),
            el.foreground?.image && addMedia(el.foreground, slideRefs, 'image', 'png'),
            el.fill?.image && addMedia(el.fill, slideRefs, 'image', 'png'),
            // el.audio?.src && addMedia(el.audio, slideRefs, 'media', 'mp3'),
            // el.video?.src && addMedia(el.video, slideRefs, 'media', 'mp4'),
            ...(el.children ?? []).flatMap(el => uploadRefs(el as SlideElement)),
          ].filter(Boolean) as T[]

        await Promise.all(uploadRefs(slide))

        // 图表:写独立 chartN.xml 部件,并把 rId 记到元素 meta.chartRId(media 之后排号)
        const collectCharts = (el: Slide | SlideElement): void => {
          const chart = (el as SlideElement).chart
          if (chart) {
            chartCount++
            add(`ppt/charts/chart${chartCount}.xml`, stringifyChart(chart))
            slideRefs.push(`../charts/chart${chartCount}.xml`)
            ;(el as any).meta = { ...(el as any).meta, chartRId: `rId${slideRefs.length}` }
          }
          ;(el.children ?? []).forEach(c => collectCharts(c as SlideElement))
        }
        collectCharts(slide)

        return { slide, slideRefs }
      }),
    )

    // 是否有演讲者备注(决定是否生成 notesMaster 及其在 presentation 关系中的 rId)
    const hasNotes = slides.some(({ slide }) => Boolean((slide as Slide).meta?.notes))
    const notesMasterId = hasNotes ? `rId${slides.length + 2}` : undefined

    // presentation
    add(
      'ppt/presentation.xml',
      stringifyPresentation(
        _pptx,
        slides.map((_, i) => `rId${i + 1}`),
        [`rId${slides.length + 1}`],
        notesMasterId,
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

      const notes = (slide as Slide).meta?.notes
      const noteRels: string[] = []
      if (notes) {
        add(`ppt/notesSlides/notesSlide${num}.xml`, stringifyNotesSlide(notes))
        add(`ppt/notesSlides/_rels/notesSlide${num}.xml.rels`, stringifyRelationships([
          '../notesMasters/notesMaster1.xml',
        ]))
        noteRels.push(`../notesSlides/notesSlide${num}.xml`)
      }

      add(`ppt/slides/_rels/slide${num}.xml.rels`, stringifyRelationships([
        ...slideRefs,
        '../slideLayouts/slideLayout1.xml',
        ...noteRels,
      ]))
      return `slides/slide${num}.xml`
    })

    // notesMaster(任一 slide 有备注时)
    if (hasNotes) {
      add('ppt/notesMasters/notesMaster1.xml', stringifyNotesMaster())
      add('ppt/notesMasters/_rels/notesMaster1.xml.rels', stringifyRelationships([
        '../theme/theme1.xml',
      ]))
    }

    // fonts
    // writeFontData(pptx, zip)

    add('ppt/_rels/presentation.xml.rels', stringifyRelationships([
      ...slideXmls,
      'slideMasters/slideMaster1.xml',
      ...(hasNotes ? ['notesMasters/notesMaster1.xml'] : []),
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
    add('docProps/core.xml', stringifyCoreProperties(_pptx.meta ?? {}))
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
