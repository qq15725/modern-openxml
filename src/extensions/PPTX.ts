import type { Zippable } from 'fflate'
import { unzipSync, zipSync } from 'fflate'
import { CoreProperties, Relationships, Types } from '../OPC'
import { Theme } from '../OpenXml/Drawing'
import { Properties } from '../OpenXml/ExtendedProperties'
import { Picture, Presentation, PresentationProperties, Slide, SlideLayout, SlideMaster, ViewProperties } from '../OpenXml/Presentation'
import { joinPaths } from '../utils'

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

  get width(): number { return this.presentation.sldSz.cx }
  get height(): number { return this.presentation.sldSz.cy }

  static getRelsPath(path = ''): { base: string, path: string } {
    const name = path.split('/').pop()
    return {
      base: joinPaths(path, '../'),
      path: joinPaths(path, '../', '_rels', `${name}.rels`),
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

  static parse(source: Uint8Array) {
    const pptx = new PPTX()
    pptx.unzipped = unzipSync(source)
    const read = (path: string): string => pptx.read(path, 'string')!
    const { getRelsPath } = PPTX

    // [Content_Types].xml
    const types = new Types(read('[Content_Types].xml'))

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
          pptx.presentation = new Presentation(read(presentationPath))
          break
        // doc/app.xml
        case Relationships.types.app:
          pptx.app = new Properties(read(path))
          break
        // doc/core.xml
        case Relationships.types.core:
          pptx.core = new CoreProperties(read(path))
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
          pptx.presProps = new PresentationProperties(read(path))
          break
        // ppt/viewProps.xml
        case Relationships.types.viewProps:
          pptx.viewProps = new ViewProperties(read(path))
          break
      }
    })

    pptx.presentation.sldIdLst.children.forEach((v) => {
      slidePaths.add(joinPaths(presentationRelsBase, presentationRels[v.rId].target))
    })

    pptx.presentation.sldMasterIdLst.children.forEach((v) => {
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
      pptx.slides.push(slide)
      pptx.slidesRels.push(slideRels)
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

      pptx.slideMasters.push(slideMaster)
      pptx.slideMastersRels.push(slideMasterRels)
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

      pptx.slideLayouts.push(slideLayout)
      pptx.slideLayoutsRels.push(slideLayoutRels)
    })

    themePaths.forEach((path) => {
      // ppt/themes/theme1.xml
      const theme = new Theme(read(path))
      theme.path = path

      pptx.themes.push(theme)
    })

    pptx.slides.forEach((slide) => {
      slide.layoutIndex = pptx.slideLayouts.findIndex(v => v.path === slide.layoutPath)
    })

    pptx.slideLayouts.forEach((slide) => {
      slide.masterIndex = pptx.slideMasters.findIndex(v => v.path === slide.masterPath)
    })

    pptx.slideMasters.forEach((slide) => {
      slide.themeIndex = pptx.themes.findIndex(v => v.path === slide.themePath)
    })

    return pptx
  }

  toZippable(): Zippable {
    const slides = this.slides.map((slide, index) => [`slide${index + 1}.xml`, slide] as const)
    const slideLayouts = this.slideLayouts.map((slide, index) => [`slideLayout${index + 1}.xml`, slide] as const)
    const slideMasters = this.slideMasters.map((slide, index) => [`slideMaster${index + 1}.xml`, slide] as const)
    const themes = this.themes.map((theme, index) => [`theme${index + 1}.xml`, theme] as const)

    const data = {
      'docProps': {
        'app.xml': this.app.toXML(),
        'core.xml': this.core.toXML(),
      },
      'ppt': {
        'presentation.xml': this.presentation.toXML(),
        'presProps.xml': this.presProps.toXML(),
        'viewProps.xml': this.viewProps.toXML(),
        'theme': Object.fromEntries(themes),
        'slideLayouts': {
          ...Object.fromEntries(slideLayouts),
          _rels: Object.fromEntries(slideLayouts.map(([name], index) => {
            return [`${name}.rels`, new Relationships([
              { target: `../slideMasters/${slideMasters[index][0]}`, type: 'slideMaster' },
            ])]
          })),
        },
        'slideMaster': {
          ...Object.fromEntries(slideMasters),
          _rels: Object.fromEntries(slideMasters.map(([name], index) => {
            return [`${name}.rels`, new Relationships([
              { target: `../slideLayouts/${slideLayouts[index][0]}`, type: 'slideLayout' },
              { target: `../theme/${themes[index][0]}`, type: 'theme' },
            ])]
          })),
        },
        'slides': {
          ...Object.fromEntries(slides),
          _rels: Object.fromEntries(slides.map(([name, slide]) => {
            // TODO slideRefs
            const slideRefs: string[] = []
            slide.elements.forEach((el) => {
              if (el instanceof Picture) {
                // el.embed
              }
            })
            return [`${name}.rels`, new Relationships([
              ...slideRefs,
              { target: `../slideLayouts/${slideLayouts[0][0]}`, type: 'slideLayout' },
            ])]
          })),
        },
        '_rels': {
          'presentation.xml.rels': new Relationships([
            //
          ]),
        },
      },
      '_rels': {
        '.rels': new Relationships([
          { target: 'ppt/presentation.xml', type: 'presentation' },
          { target: 'ppt/presProps.xml', type: 'presProps' },
          { target: 'ppt/viewProps.xml', type: 'viewProps' },
        ]),
      },
      '[Content_Types].xml': '',
    }

    return data
  }

  toBuffer(): ArrayBuffer {
    return zipSync(this.toZippable()).buffer
  }

  toJSON() {
    return {
      width: this.width,
      height: this.height,
      app: this.app?.toJSON(),
      core: this.core?.toJSON(),
      themes: this.themes.map(v => v.toJSON()),
      slideMasters: this.slideMasters.map(v => v.toJSON()),
      slideLayouts: this.slideLayouts.map(v => v.toJSON()),
      slides: this.slides.map(v => v.toJSON()),
      presentation: this.presentation?.toJSON(),
      presProps: this.presProps?.toJSON(),
      viewProps: this.viewProps?.toJSON(),
    }
  }
}
