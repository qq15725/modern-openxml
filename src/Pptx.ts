import type { Zippable } from 'fflate'
import type { Theme } from './OpenXml/Drawing'
import type { SlideLayout } from './OpenXml/Presentation'
import { unzipSync, zipSync } from 'fflate'
import { CoreProperties, Relationships, Types } from './OPC'
import { Properties } from './OpenXml/ExtendedProperties'
import { Picture, Presentation, PresentationProperties, Slide, SlideMaster, ViewProperties } from './OpenXml/Presentation'

export class Pptx {
  declare app: Properties
  declare core: CoreProperties
  themes: Theme[] = []
  slideMasters: SlideMaster[] = []
  slideLayouts: SlideLayout[] = []
  slides: Slide[] = []
  declare presentation: Presentation
  declare presProps: PresentationProperties
  declare viewProps: ViewProperties

  get width(): number { return this.presentation.sldSz.cx }
  get height(): number { return this.presentation.sldSz.cy }

  static parse(source: Uint8Array) {
    const unzipped = unzipSync(source)

    const readXml = (path: string) => new TextDecoder().decode(unzipped[path])
    const getRelsPath = (path = '') => {
      const paths = path.split('/')
      const name = paths.pop()
      return {
        base: paths.join('/'),
        path: [...paths, '_rels', `${name}.rels`].join('/'),
      }
    }

    const pptx = new Pptx()

    // [Content_Types].xml
    const types = new Types().fromXML(readXml('[Content_Types].xml'))

    // _rels/.rels
    const { path: relsPath } = getRelsPath()
    const rels = new Relationships().fromXML(readXml(relsPath)).value

    let presentationPath
    rels.forEach((rel) => {
      switch (rel.type) {
        // ppt/presentation.xml
        case Relationships.types.presentation:
          presentationPath = rel.target
          pptx.presentation = new Presentation().fromXML(readXml(presentationPath))
          break
        // doc/app.xml
        case Relationships.types.app:
          pptx.app = new Properties().fromXML(readXml(rel.target))
          break
        // doc/core.xml
        case Relationships.types.core:
          pptx.core = new CoreProperties().fromXML(readXml(rel.target))
          break
        // doc/custom.xml
        case Relationships.types.custom:
          break
      }
    })

    // ppt/_rels/presentation.xml.rels
    const { base: presentationRelsBase, path: presentationRelsPath } = getRelsPath(presentationPath)
    const presentationRels = new Relationships().fromXML(readXml(presentationRelsPath)).value

    presentationRels.forEach((rel) => {
      const target = `${presentationRelsBase}/${rel.target}`
      switch (rel.type) {
        // ppt/presProps.xml
        case Relationships.types.presProps:
          pptx.presProps = new PresentationProperties().fromXML(readXml(target))
          break
        // ppt/viewProps.xml
        case Relationships.types.viewProps:
          pptx.viewProps = new ViewProperties().fromXML(readXml(target))
          break
      }
    })

    const ridToTarget = Object.fromEntries(
      presentationRels.map(v => [v.id, `${presentationRelsBase}/${v.target}`]),
    )

    pptx.presentation.sldIdLst.children.forEach((v) => {
      // ppt/slides/slide1.xml
      const slidePath = ridToTarget[v.rId]
      const slide = new Slide().fromXML(readXml(slidePath))

      // ppt/slides/_rels/slide1.xml.rels
      const { base: slideRelsBase, path: slideRelsPath } = getRelsPath(slidePath)
      const slideRels = new Relationships().fromXML(readXml(slideRelsPath)).value
      slideRels.forEach((rel) => {
        switch (rel.type) {
          // ppt/slideLayout/slideLayout1.xml
          case Relationships.types.slideLayout: {
            // const slideLayout = new SlideLayout().parse(readXml(rel.target))
            // pptx.slides.push(slideLayout)
            break
          }
        }
      })

      pptx.slides.push(slide)
    })

    pptx.presentation.sldMasterIdLst.children.forEach((v) => {
      // slideMasters/slideMaster1.xml
      const slideMasterPath = ridToTarget[v.rId]
      const slideMaster = new SlideMaster().fromXML(readXml(slideMasterPath))
      pptx.slideMasters.push(slideMaster)

      // ppt/slides/_rels/slide1.xml.rels
      const { base: slideMasterRelsBase, path: slideMasterRelsPath } = getRelsPath(slideMasterPath)
      const slideMasterRels = new Relationships().fromXML(readXml(slideMasterRelsPath)).value
      console.log(slideMasterRels)
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
