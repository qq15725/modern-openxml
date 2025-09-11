import type { Unzipped } from 'fflate'
import type {
  NormalizedElement,
  NormalizedFill,
  NormalizedImageFill,
} from 'modern-idoc'
import type {
  NormalizedPptx,
  PptxSource,
  Slide,
  SlideElement,
  SlideLayout,
  SlideMaster,
} from '../ooxml'
import { unzipSync } from 'fflate'
import { idGenerator, isGradient } from 'modern-idoc'
import {
  clearUndef,
  OoxmlNode,
  parseCoreProperties,
  parsePresentation,
  parseRelationships,
  parseSlide,
  parseSlideLayout,
  parseSlideMaster,
  parseTheme,
  parseTypes,
  pathJoin,
} from '../ooxml'

export interface PptxUploadOptions {
  upload?: (input: string, file: NormalizedImageFill, source: NormalizedPptx | Slide | SlideLayout | SlideMaster | SlideElement) => any | Promise<any>
  progress?: (progress: number, total: number, cached: boolean) => void
}

export interface PptxDecodeOptions {
  presetShapeDefinitions?: string
}

export interface PptxConvertOptions extends PptxDecodeOptions, PptxUploadOptions {
  //
}

function isNodeReadableStream(obj: any): obj is NodeJS.ReadableStream {
  return obj && typeof obj.read === 'function' && typeof obj.on === 'function'
}

export class PptxToIdocConverter {
  unzipped?: Unzipped
  pptx?: NormalizedPptx

  protected async _resolveSource(source: PptxSource): Promise<Uint8Array> {
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

  protected _createNode(xml?: string): OoxmlNode {
    return OoxmlNode.fromXML(xml)
  }

  protected _readNode(path?: string): OoxmlNode {
    return this._createNode(this._readFile(path, 'text'))
  }

  protected _getRelsPath(path = ''): string {
    const paths = path.split('/')
    const name = paths.pop()
    return pathJoin(...paths, '_rels', `${name}.rels`)
  }

  async decode(source: PptxSource, options: PptxDecodeOptions = {}): Promise<NormalizedPptx> {
    this.unzipped = unzipSync(await this._resolveSource(source))

    const presetShapeDefinitions = options.presetShapeDefinitions
      ? this._createNode(options.presetShapeDefinitions)
      : undefined

    // [Content_Types].xml
    const contentTypes = parseTypes(this._readNode('[Content_Types].xml')!)

    // docProps/core
    const coreProperties = parseCoreProperties(this._readNode('docProps/core.xml')!)

    // _rels/.rels
    const relsPath = this._getRelsPath()
    const relsNode = this._readNode(relsPath)!
    const rels = parseRelationships(relsNode, relsPath, contentTypes)

    // ppt/presentation.xml
    const presentationPath = rels.find(v => v.type === 'presentation')?.path
    const presentationNode = this._readNode(presentationPath)!
    const presentation = parsePresentation(presentationNode)!

    // ppt/_rels/presentation.xml.rels
    const presentationRelsPath = this._getRelsPath(presentationPath)
    const presentationRels = parseRelationships(
      this._readNode(presentationRelsPath)!,
      presentationRelsPath,
      contentTypes,
    )

    const pptx: NormalizedPptx = {
      id: idGenerator(),
      style: {
        width: presentation.slideWidth,
        height: presentation.slideHeight * presentation.slides.length,
      },
      children: [],
      meta: {
        ...coreProperties,
        themes: [],
        slides: [],
        slideLayouts: [],
        slideMasters: [],
        // docProps/thumbnail.jpeg
        cover: relsNode.attr(
          'Relationships/Relationship[@Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/thumbnail"]/@Target',
        )!,
      },
    }

    // ppt/slides/slideX.xml
    let i = 0
    for (const _slide of presentation.slides) {
      const slideId = _slide.rId
      const slidePath = presentationRels.find(v => v.id === slideId)!.path

      // ppt/slides/_rels/slideX.xml.rels
      const slideRelsPath = this._getRelsPath(slidePath)
      const slideRels = parseRelationships(this._readNode(slideRelsPath)!, slideRelsPath, contentTypes)

      // ppt/slideLayouts/_rels/slideX.xml.rels
      const layoutPath = slideRels.find(v => v.type === 'slideLayout')!.path
      const layoutRelsPath = this._getRelsPath(layoutPath)
      const layoutRels = parseRelationships(this._readNode(layoutRelsPath)!, layoutRelsPath, contentTypes)

      // ppt/slideMasters/_rels/slideX.xml.rels
      const masterPath = layoutRels.find(v => v.type === 'slideMaster')!.path
      const masterRelsPath = this._getRelsPath(masterPath)
      const masterRels = parseRelationships(this._readNode(masterRelsPath)!, masterRelsPath, contentTypes)

      // ppt/theme/themeX.xml
      const themePath = masterRels.find(v => v.type === 'theme')?.path

      const themeNode = this._readNode(themePath)
      const layoutNode = this._readNode(layoutPath)!
      const masterNode = this._readNode(masterPath)!
      const slideNode = this._readNode(slidePath)!

      const drawingRels = await Promise.all(
        slideRels
          .filter(v => v.type === 'diagramDrawing')
          .map(async (rel) => {
            const relsPath = this._getRelsPath(rel.path)
            const rels = parseRelationships(this._readNode(relsPath), relsPath, contentTypes)
            return {
              ...rel,
              node: this._readNode(rel.path)!,
              rels,
            }
          }),
      )
      const dataRels = await Promise.all(
        slideRels
          .filter(v => v.type === 'diagramData')
          .map(async (rel) => {
            const relsPath = this._getRelsPath(rel.path)
            const rels = parseRelationships(this._readNode(relsPath), relsPath, contentTypes)
            return {
              ...rel,
              node: this._readNode(rel.path)!,
              rels,
            }
          }),
      )

      const theme = themeNode && themePath
        ? parseTheme(themeNode, themePath)
        : undefined

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

      if (pptx.meta.slideLayouts.findIndex(slide => slide.meta.pptPath === layout.meta.pptPath) === -1) {
        pptx.meta.slideLayouts.push(layout)
      }

      if (pptx.meta.slideMasters.findIndex(slide => slide.meta.pptPath === master.meta.pptPath) === -1) {
        pptx.meta.slideMasters.push(master)
      }

      if (theme && pptx.meta.themes.findIndex(_theme => _theme.meta.pptPath === theme.meta.pptPath) === -1) {
        pptx.meta.themes.push(theme)
      }

      pptx.meta.slides.push(slide)

      ;(slide.style as any).top += i * presentation.slideHeight

      pptx.children.push({
        ...slide,
        background: slide.background ?? layout?.background ?? master?.background,
      })

      i++
    }

    this.pptx = clearUndef(pptx)

    return this.pptx
  }

  static mimeTypes: { [key: string]: string } = {
    '.apng': 'image/apng',
    '.bmp': 'image/bmp',
    '.gif': 'image/gif',
    '.ico': 'image/vnd.microsoft.icon',
    '.cur': 'image/x-icon',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.jfif': 'image/jpeg',
    '.pjpeg': 'image/jpeg',
    '.pjp': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.tif': 'image/tiff',
    '.tiff': 'image/tiff',
    '.webp': 'image/webp',

    '.aac': 'audio/aac',
    '.mid': 'audio/midi',
    '.midi': 'audio/midi',
    '.mp3': 'audio/mpeg',
    '.oga': 'audio/ogg',
    '.opus': 'audio/opus',
    '.wav': 'audio/wav',
    '.weba': 'audio/webm',
    '.3gp': 'audio/3gpp',
    '.flac': 'audio/flac',

    '.avi': 'video/x-msvideo',
    '.mp4': 'video/mp4',
    '.mpeg': 'video/mpeg',
    '.ogv': 'video/ogg',
    '.ts': 'video/mp2t',
    '.webm': 'video/webm',
    '.3g2': 'video/3gpp2',
    '.mov': 'video/quicktime',
    '.wmv': 'video/x-ms-wmv',
    '.flv': 'video/x-flv',
    '.mkv': 'video/x-matroska',
  }

  static getMimeType(filePath: string): string | undefined {
    return this.mimeTypes[filePath.substring(filePath.lastIndexOf('.')).toLowerCase()] || undefined
  }

  async upload(options: PptxUploadOptions = {}, pptx = this.pptx): Promise<NormalizedPptx> {
    if (!pptx) {
      throw new Error('Failed to upload, miss pptx object')
    }

    const {
      progress,
      upload = (input, fill) => {
        return `data:${PptxToIdocConverter.getMimeType(fill.image) ?? 'image/png'};base64,${input}`
      },
    } = options

    const cache = new Map<string, Promise<any>>()
    let current = 0
    const tasks = []

    const _upload = async (fill: NormalizedImageFill, source: NormalizedElement): Promise<string> => {
      const key = JSON.stringify({ ...fill, width: (source as any).width, height: (source as any).height })
      let promise: Promise<any>
      const cached = cache.has(key)
      if (cached) {
        promise = cache.get(key)!
      }
      else {
        promise = upload?.(this._readFile(fill.image, 'base64'), fill, source as any)
        cache.set(key, promise)
      }
      const output = await promise
      progress?.(++current, tasks.length, cached)
      if (output) {
        fill.image = output
      }
      return output
    }

    function needsUpload(value?: NormalizedFill): value is NormalizedImageFill {
      return Boolean(value?.image) && !isGradient(value!.image!)
    }

    function handleUpload(el: NormalizedElement): Promise<any>[] {
      return [
        needsUpload(el.background) && _upload(el.background, el),
        needsUpload(el.fill) && _upload(el.fill, el),
        needsUpload(el.foreground) && _upload(el.foreground, el),
        // el.audio?.src && _upload(el.audio, el),
        // el.video?.src && _upload(el.video, el),
        ...(el.children?.flatMap(childEl => handleUpload(childEl as any)) ?? []),
      ].filter(Boolean) as Promise<any>[]
    }

    tasks.push(
      ...(
        [
          pptx.meta.cover && (async () => (pptx.meta.cover = await _upload({ image: pptx.meta.cover! }, pptx))),
          ...pptx.children.flatMap(handleUpload),
          ...pptx.meta.slideLayouts.flatMap(handleUpload),
          ...pptx.meta.slideMasters.flatMap(handleUpload),
        ].filter(Boolean) as Promise<any>[]
      ),
    )

    await Promise.all(tasks)

    return pptx
  }

  async convert(source: PptxSource, options: PptxConvertOptions = {}): Promise<NormalizedPptx> {
    return await this.upload(
      options,
      await this.decode(source, options),
    )
  }
}
