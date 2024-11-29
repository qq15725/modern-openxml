import type { Zippable } from 'fflate'
import type { PresentationProperties, ViewProperties } from '../openxml'
import type { CoreProperties, Properties } from './doc'
import { zipSync } from 'fflate'
import { Picture, Presentation, Slide, SlideLayout, SlideMaster, Theme } from '../openxml'
import { ContentTypes, Relationships } from './doc'

interface PptxProps {
  width?: number
  height?: number
  slides: SlideProps[]
}

export class Pptx {
  declare app: Properties
  declare core: CoreProperties
  declare themes: Theme[]
  declare slideMasters: SlideMaster[]
  declare slideLayouts: SlideLayout[]
  declare slides: Slide[]
  declare presentation: Presentation
  declare presProps: PresentationProperties
  declare viewProps: ViewProperties

  get width() { this.presentation.sldSz.cx }
  get height() { this.presentation.sldSz.cy }

  constructor() {

  }

  async decode(source: Source) {
    const jszip = new Jszip()
    const zip = await jszip.loadAsync(source)

    const read = async (path: string, type: 'base64' | 'string' = 'string') => {
      if (path.startsWith('/'))
        path = path.substring(1)
      return zip.files[path]?.async(type)
    }

    const getRelsPath = (path = '') => {
      const paths = path.split('/')
      const last = paths.length - 1
      return [...paths.slice(0, last), '_rels', `${paths[last]}.rels`].join('/')
    }

    // [Content_Types].xml
    const contentTypes_ = await read('[Content_Types].xml')
    const contentTypes = ContentTypes.parse(createVNode(contentTypes_?.replace(/xmlns=".+?"/g, '')))

    // _rels/.rels
    const relationshipsPath = getRelsPath()
    const relationships_ = await read(relationshipsPath)
    const relationships = Relationship.parse(
      createVNode(relationships_?.replace(/xmlns=".+?"/g, '')),
      relationshipsPath,
      contentTypes,
    )

    // ppt/presentation.xml
    const presentationPath = relationships.find(v => v.type === 'presentation')?.path
    if (!presentationPath)
      return undefined
    const presentation_ = await read(presentationPath)
    const presentationNode = createVNode(presentation_)
    const presentation = Presentation.parse(presentationNode)

    // ppt/_rels/presentation.xml.rels
    const presentationRelsPath = getRelsPath(presentationPath)
    const presentationRels_ = await read(presentationRelsPath)
    const presentationRels = Relationship.parse(
      createVNode(presentationRels_?.replace(/xmlns=".+?"/g, '')),
      presentationRelsPath,
      contentTypes,
    )

    // slides
    const slides = presentationRels.filter(v => v.type === 'slide').map(v => v.path)

    const props: PptxProps = {
      width: presentation?.width,
      height: presentation?.height,
      slides: [],
    }

    for (const slidePath of slides) {
      // slide rels
      const slideRelsPath = getRelsPath(slidePath)
      const slideRels_ = await read(slideRelsPath)
      const slideRels = Relationship.parse(
        createVNode(slideRels_?.replace(/xmlns=".+?"/g, '')),
        slideRelsPath,
        contentTypes,
      )

      // slideLayout rels
      const layoutPath = slideRels.find(v => v.type === 'slideLayout')?.path
      const layoutRelsPath = getRelsPath(layoutPath)
      const layoutRels_ = await read(layoutRelsPath)
      const layoutRels = Relationship.parse(
        createVNode(layoutRels_?.replace(/xmlns=".+?"/g, '')),
        layoutRelsPath,
        contentTypes,
      )

      // slideMaster rels
      const masterPath = layoutRels.find(v => v.type === 'slideMaster')?.path
      const masterRelsPath = getRelsPath(masterPath)
      const masterRels_ = await read(masterRelsPath)
      const masterRels = Relationship.parse(
        createVNode(masterRels_?.replace(/xmlns=".+?"/g, '')),
        masterRelsPath,
        contentTypes,
      )

      // theme
      const themePath = masterRels.find(v => v.type === 'theme')?.path

      const theme = themePath ? createVNode(await read(themePath)) : undefined
      const layout = layoutPath ? createVNode(await read(layoutPath)) : undefined
      const master = masterPath ? createVNode(await read(masterPath)) : undefined
      const slide = createVNode(await read(slidePath))

      const context = {
        theme: {
          node: theme,
          ...Theme.parse(theme),
        },
        layout: {
          node: layout,
          ...SlideLayout.parse(layout),
        },
        master: {
          node: master,
          ...SlideMaster.parse(master),
        },
        presentation: {
          node: presentationNode,
          ...presentation,
        },
        rels: slideRels,
      }

      const slideProps = Slide.parse(slide, context)

      for (const element of slideProps.elements) {
        if (element.type === 'picture') {
          (element as any).content = await read((element as any).content, 'base64')
        }
      }

      props.slides.push(slideProps)
    }

    return clearUndefProp(props)
  }

  toZippable(): Zippable {
    const slides = this.slides.map((slide, index) => [`slide${index + 1}.xml`, slide] as const)
    const slideLayouts = this.slideLayouts.map((slide, index) => [`slideLayout${index + 1}.xml`, slide] as const)
    const slideMasters = this.slideMasters.map((slide, index) => [`slideMaster${index + 1}.xml`, slide] as const)
    const themes = this.themes.map((theme, index) => [`theme${index + 1}.xml`, theme] as const)

    const data = {
      'docProps': {
        'app.xml': this.app,
        'core.xml': this.core,
      },
      'ppt': {
        'presentation.xml': this.presentation,
        'presProps.xml': this.presProps,
        'viewProps.xml': this.viewProps,
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
}
