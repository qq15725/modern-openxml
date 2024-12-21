import type { CorePropertiesJSON } from '../OPC'
import type { PropertiesJSON } from '../OpenXml/ExtendedProperties'
import type {
  PresentationJSON,
  PresentationPropertiesJSON,
  SlideJSON,
  SlideLayoutJSON,
  SlideMasterJSON,
} from '../OpenXml/Presentation'
import { unzipSync } from 'fflate'
import { CoreProperties, Relationships, Types } from '../OPC'
import { PresetShapeDefinitions, Theme } from '../OpenXml/Drawing'
import { Properties } from '../OpenXml/ExtendedProperties'
import {
  Presentation,
  PresentationProperties,
  Slide,
  SlideLayout,
  SlideMaster,
  ViewProperties,
} from '../OpenXml/Presentation'
import { joinPaths } from '../utils'

export interface PPTXJSON {
  app?: PropertiesJSON
  core?: CorePropertiesJSON
  presentation?: PresentationJSON
  presProps?: PresentationPropertiesJSON
  // viewProps?: any
  slideMasters: SlideMasterJSON[]
  slideLayouts: SlideLayoutJSON[]
  slides: SlideJSON[]
  // themes: any[]
}

export interface PPTXOptions {
  presetShapeDefinitions?: string
}

export type PPTXSource =
  | ArrayBuffer
  | Uint8Array
  | Partial<PPTXJSON>

/**
 * @link https://learn.microsoft.com/en-us/openspecs/office_standards/ms-pptx/efd8bb2d-d888-4e2e-af25-cad476730c9f
 */
export class PPTX {
  unzipped: { [path: string]: Uint8Array } = {}

  declare app: Properties
  declare core: CoreProperties
  themes: Theme[] = []
  themesRels: Record<string, any>[] = []
  slideMasters: SlideMaster[] = []
  slideMastersRels: Record<string, any>[] = []
  slideLayouts: SlideLayout[] = []
  slideLayoutsRels: Record<string, any>[] = []
  slides: Slide[] = []
  slidesRels: Record<string, any>[] = []
  declare presentation: Presentation
  declare presProps: PresentationProperties
  declare viewProps: ViewProperties
  presetShapeDefinitions?: PresetShapeDefinitions

  get width(): number { return this.presentation.sldSz.cx }
  get height(): number { return this.presentation.sldSz.cy }

  static getRelsPath(path = ''): { base: string, path: string } {
    const name = path.split('/').pop()
    return {
      base: joinPaths(path, '../'),
      path: joinPaths(path, '../', '_rels', `${name}.rels`),
    }
  }

  constructor(source: PPTXSource = {}, options?: PPTXOptions) {
    if (ArrayBuffer.isView(source)) {
      this._parseBuffer(source.buffer as ArrayBuffer)
    }
    else if (source instanceof ArrayBuffer) {
      this._parseBuffer(source)
    }
    else {
      this._parseJSON(source)
    }

    if (options?.presetShapeDefinitions) {
      this.presetShapeDefinitions = new PresetShapeDefinitions(
        options.presetShapeDefinitions,
      )
    }
  }

  readRid(rId: string, type: string, index = 0): any | undefined {
    switch (type) {
      case 'slide':
        return this.read(this.slidesRels[index][rId].path, 'dataURI')
      case 'layout':
        return this.read(this.slideLayoutsRels[index][rId].path, 'dataURI')
      case 'master':
        return this.read(this.slideMastersRels[index][rId].path, 'dataURI')
      default:
        return undefined
    }
  }

  read(path: string): ArrayBuffer | undefined
  read(path: string, type: 'string'): string | undefined
  read(path: string, type: 'dataURI'): string | undefined
  read(path: string, type?: string): any | undefined {
    const uint8Array = this.unzipped[path]
    if (!uint8Array) {
      return undefined
    }
    switch (type) {
      case 'string':
        return new TextDecoder().decode(uint8Array)
      case 'dataURI':
        return `data:image/png;base64,${btoa(Array.from(uint8Array, byte => String.fromCharCode(byte)).join(''))}`
      default:
        return uint8Array.buffer
    }
  }

  protected _parseBuffer(source: ArrayBuffer): void {
    this.unzipped = unzipSync(new Uint8Array(source))
    const read = (path: string): string => this.read(path, 'string')!
    const { getRelsPath } = PPTX

    // [Content_Types].xml
    const _types = new Types(read('[Content_Types].xml'))

    // _rels/.rels
    const { path: relsPath } = getRelsPath()
    const rels = new Relationships(read(relsPath)).value

    let presentationPath
    const slidePaths = new Set<string>()
    const slideMasterPaths = new Set<string>()
    const slideLayoutPaths = new Set<string>()
    const themePaths = new Set<string>()

    Object.values(rels).forEach((rel) => {
      const path = rel.target
      switch (rel.type) {
        // ppt/presentation.xml
        case Relationships.types.presentation:
          presentationPath = path
          this.presentation = new Presentation(read(presentationPath))
          break
        // doc/app.xml
        case Relationships.types.app:
          this.app = new Properties(read(path))
          break
        // doc/core.xml
        case Relationships.types.core:
          this.core = new CoreProperties(read(path))
          break
        // doc/custom.xml
        case Relationships.types.custom:
          break
      }
    })

    // ppt/_rels/presentation.xml.rels
    const { base: presentationRelsBase, path: presentationRelsPath } = getRelsPath(presentationPath)
    const presentationRels = new Relationships(read(presentationRelsPath)).value

    Object.values(presentationRels).forEach((rel) => {
      const path = joinPaths(presentationRelsBase, rel.target)
      switch (rel.type) {
        // ppt/presProps.xml
        case Relationships.types.presProps:
          this.presProps = new PresentationProperties(read(path))
          break
        // ppt/viewProps.xml
        case Relationships.types.viewProps:
          this.viewProps = new ViewProperties(read(path))
          break
      }
    })

    this.presentation.sldIdLst.children.forEach((v) => {
      slidePaths.add(joinPaths(presentationRelsBase, presentationRels[v.rId].target))
    })

    this.presentation.sldMasterIdLst.children.forEach((v) => {
      slideMasterPaths.add(joinPaths(presentationRelsBase, presentationRels[v.rId].target))
    })

    slidePaths.forEach((path) => {
      // ppt/slides/slide1.xml
      const slide = new Slide(read(path))
      slide.path = path

      // ppt/slides/_rels/slide1.xml.rels
      const { base: slideRelsBase, path: slideRelsPath } = getRelsPath(path)
      const slideRels: Record<string, any> = new Relationships(read(slideRelsPath)).value
      Object.values(slideRels).forEach((rel) => {
        const path = joinPaths(slideRelsBase, rel.target)
        rel.path = path
        switch (rel.type) {
          // ppt/slideLayout/slideLayout1.xml
          case Relationships.types.slideLayout: {
            slideLayoutPaths.add(path)
            slide.layoutPath = path
            break
          }
        }
      })
      this.slides.push(slide)
      this.slidesRels.push(slideRels)
    })

    slideMasterPaths.forEach((path) => {
      // ppt/slideMasters/slideMaster1.xml
      const slideMaster = new SlideMaster(read(path))
      slideMaster.path = path

      // ppt/slideMasters/_rels/slideMaster1.xml.rels
      const { base: slideMasterRelsBase, path: slideMasterRelsPath } = getRelsPath(path)
      const slideMasterRels: Record<string, any> = new Relationships(read(slideMasterRelsPath)).value
      Object.values(slideMasterRels).forEach((rel) => {
        const path = joinPaths(slideMasterRelsBase, rel.target)
        rel.path = path
        switch (rel.type) {
          case Relationships.types.theme:
            slideMaster.themePath = path
            themePaths.add(path)
            break
        }
      })

      slideMaster.sldLayoutIdLst?.children.forEach((v) => {
        slideLayoutPaths.add(joinPaths(slideMasterRelsBase, slideMasterRels[v.rId].target))
      })

      this.slideMasters.push(slideMaster)
      this.slideMastersRels.push(slideMasterRels)
    })

    slideLayoutPaths.forEach((path) => {
      // ppt/slides/slideLayout1.xml
      const slideLayout = new SlideLayout(read(path))
      slideLayout.path = path

      // ppt/slides/_rels/slideLayout1.xml.rels
      const { base: slideRelsBase, path: slideRelsPath } = getRelsPath(path)
      const slideLayoutRels: Record<string, any> = new Relationships(read(slideRelsPath)).value
      Object.values(slideLayoutRels).forEach((rel) => {
        const path = joinPaths(slideRelsBase, rel.target)
        rel.path = path
        switch (rel.type) {
          case Relationships.types.slideMaster:
            slideLayout.masterPath = path
            break
        }
      })

      this.slideLayouts.push(slideLayout)
      this.slideLayoutsRels.push(slideLayoutRels)
    })

    themePaths.forEach((path) => {
      // ppt/themes/theme1.xml
      const theme = new Theme(read(path))
      theme.path = path

      this.themes.push(theme)
    })

    this.slides.forEach((slide) => {
      slide.layoutIndex = this.slideLayouts.findIndex(v => v.path === slide.layoutPath)
    })

    this.slideLayouts.forEach((slide) => {
      slide.masterIndex = this.slideMasters.findIndex(v => v.path === slide.masterPath)
    })

    this.slideMasters.forEach((slide) => {
      slide.themeIndex = this.themes.findIndex(v => v.path === slide.themePath)
    })
  }

  protected _parseJSON(JSON: Partial<PPTXJSON> = {}): void {
    const {
      app,
      core,
      presProps,
      presentation,
      slideMasters = [],
      slideLayouts = [],
      slides = [],
    } = JSON

    this.app = new Properties(app)
    this.core = new CoreProperties(core)
    this.presProps = new PresentationProperties(presProps)
    this.viewProps = new ViewProperties()
    this.presentation = new Presentation(presentation)
    this.slideMasters = slideMasters.map(JSON => new SlideMaster(JSON))
    this.slideLayouts = slideLayouts.map(JSON => new SlideLayout(JSON))
    this.slides = slides.map(JSON => new Slide(JSON))
  }

  toJSON(): PPTXJSON {
    return {
      app: this.app?.toJSON(),
      core: this.core?.toJSON(),
      presentation: this.presentation?.toJSON(),
      presProps: this.presProps?.toJSON(),
      // viewProps: this.viewProps?.toJSON(),
      // themes: this.themes.map(v => v.toJSON()),
      slideMasters: this.slideMasters.map((master) => {
        const theme = this.themes[master?.themeIndex]
        return master.toJSON({
          presetShapeDefinitions: this.presetShapeDefinitions,
          theme,
        })
      }),
      slideLayouts: this.slideLayouts.map((layout) => {
        const master = this.slideMasters[layout?.masterIndex]
        const theme = this.themes[master?.themeIndex]
        return layout.toJSON({
          presetShapeDefinitions: this.presetShapeDefinitions,
          master,
          theme,
        })
      }),
      slides: this.slides.map((slide) => {
        const layout = this.slideLayouts[slide.layoutIndex]
        const master = this.slideMasters[layout?.masterIndex]
        const theme = this.themes[master?.themeIndex]
        return slide.toJSON({
          presetShapeDefinitions: this.presetShapeDefinitions,
          presentation: this.presentation,
          layout,
          master,
          theme,
        })
      }),
    }
  }
}
