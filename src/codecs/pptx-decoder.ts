import type { Unzipped } from 'fflate'
import type { IDOCDocumentDeclaration } from 'modern-idoc'
import type { Slide, SlideElement, SlideLayout, SlideMaster, Theme } from '../ooxml'
import { unzipSync } from 'fflate'
import { clearUndef, namespaces, OOXMLNode, parsePresentation, parseRelationships, parseSlide, parseSlideLayout, parseSlideMaster, parseTheme, parseTypes } from '../ooxml'

export interface DecodedPPTXMeta {
  cover?: string
  themes: Theme[]
  slideLayouts: SlideLayout[]
  slideMasters: SlideMaster[]
}

export interface DecodedPPTX extends IDOCDocumentDeclaration {
  style: {
    width: number
    height: number
  }
  children: Slide[]
  meta: DecodedPPTXMeta
}

export type DecodeingPPTXSource = string | number[] | Uint8Array | ArrayBuffer | Blob | NodeJS.ReadableStream

export interface UploadPPTXOptions {
  upload?: (input: string, file: { src: string }, source: DecodedPPTX | Slide | SlideLayout | SlideMaster | SlideElement) => any | Promise<any>
  progress?: (progress: number, total: number, cached: boolean) => void
}

export interface DecodePPTXOptions extends UploadPPTXOptions {
  presetShapeDefinitions?: string
}

function isNodeReadableStream(obj: any): obj is NodeJS.ReadableStream {
  return obj && typeof obj.read === 'function' && typeof obj.on === 'function'
}

export class PPTXDecoder {
  unzipped?: Unzipped
  pptx?: DecodedPPTX

  protected async _resolveSource(source: DecodeingPPTXSource): Promise<Uint8Array> {
    if (typeof source === 'string') {
      return new TextEncoder().encode(source)
    }
    else if (Array.isArray(source)) {
      return new Uint8Array(source)
    }
    else if (source instanceof Uint8Array) {
      return source
    }
    else if (source instanceof ArrayBuffer) {
      return new Uint8Array(source)
    }
    else if (source instanceof Blob) {
      const arrayBuffer = await source.arrayBuffer()
      return new Uint8Array(arrayBuffer)
    }
    else if (isNodeReadableStream(source)) {
      const chunks: Uint8Array[] = []
      for await (const chunk of source) {
        chunks.push(typeof chunk === 'string' ? new TextEncoder().encode(chunk) : new Uint8Array(chunk))
      }
      const totalLength = chunks.reduce((acc, val) => acc + val.length, 0)
      const result = new Uint8Array(totalLength)
      let offset = 0
      for (const chunk of chunks) {
        result.set(chunk, offset)
        offset += chunk.length
      }
      return result
    }
    else {
      throw new Error('Unsupported source type')
    }
  }

  protected _resolvePath(path: string): string {
    return path.startsWith('/') ? path.substring(1) : path
  }

  protected _readFile(path?: string, type?: 'text' | 'base64'): any | undefined {
    const uint8Array = path ? this.unzipped?.[this._resolvePath(path)] : undefined
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

  async decode(source: DecodeingPPTXSource, options: DecodePPTXOptions = {}): Promise<DecodedPPTX> {
    this.unzipped = unzipSync(await this._resolveSource(source))

    const createNode = (xml?: string): OOXMLNode => OOXMLNode.fromXML(xml, namespaces)
    const readNode = (path?: string): OOXMLNode => createNode(this._readFile(path, 'text'))
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

    const pptx: DecodedPPTX = {
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
        cover: relsNode.attr(
          'Relationships/Relationship[@Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/thumbnail"]/@Target',
        )!,
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

    this.pptx = pptx

    await this.upload(options)

    return clearUndef(pptx)
  }

  async upload(options: UploadPPTXOptions = {}, pptx = this.pptx): Promise<DecodedPPTX> {
    if (!pptx) {
      throw new Error('Failed to upload, miss pptx object')
    }

    const {
      progress,
      upload = (input) => {
        return `data:image/png;base64,${input}`
      },
    } = options

    const cache = new Map<string, Promise<any>>()
    let current = 0
    const tasks = []

    const _upload = async (file: any, source: DecodedPPTX | Slide | SlideLayout | SlideMaster | SlideElement): Promise<string> => {
      const key = JSON.stringify({ ...file, width: (source as any).width, height: (source as any).height })
      let promise: Promise<any>
      const cached = cache.has(key)
      if (cached) {
        promise = cache.get(key)!
      }
      else {
        promise = upload?.(this._readFile(file.src, 'base64'), file as any, source)
        cache.set(key, promise)
      }
      const output = await promise
      progress?.(++current, tasks.length, cached)
      if (output) {
        file.src = output
      }
      return output
    }

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

    tasks.push(
      ...(
        [
          pptx.meta.cover && (async () => (pptx.meta.cover = await _upload({ src: pptx.meta.cover! }, pptx))),
          ...pptx.children.flatMap(flatMapSlide),
          ...pptx.meta.slideLayouts.flatMap(flatMapSlide),
          ...pptx.meta.slideMasters.flatMap(flatMapSlide),
        ].filter(Boolean) as Promise<any>[]
      ),
    )

    await Promise.all(tasks)

    return pptx
  }
}
