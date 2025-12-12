import type { NormalizedElement } from 'modern-idoc'
import type { OoxmlNode } from '../core'
import type { ConnectionShape } from './connectionShape'
import type { GraphicFrame } from './graphicFrame'
import type { GroupShape } from './groupShape'
import type { Picture } from './picture'
import type { Shape } from './shape'
import type { Timing } from './timing'
import type { Transition } from './transition'
import { idGenerator } from 'modern-idoc'
import { withIndents } from '../utils'
import { parseBackground, stringifyBackground } from './background'
import { parseConnectionShape } from './connectionShape'
import { parseGraphicFrame } from './graphicFrame'
import { parseGroupShape, stringifyGroupShape } from './groupShape'
import { parsePicture, stringifyPicture } from './picture'
import { parseShape, stringifyShape } from './shape'
import { parseTiming, stringifyTiming } from './timing'
import { parseTransition, stringifyTransition } from './transition'

export type SlideElement
  = | Picture
    | Shape
    | ConnectionShape
    | GroupShape
    | GraphicFrame

export interface SlideMeta {
  inCanvasIs: 'Element2D'
  inPptIs: 'Slide'
  pptPath: string
  pptLayoutPath: string
  pptMasterPath: string
  pptThemePath: string
}

export interface Slide extends Transition, Timing, NormalizedElement {
  children: SlideElement[]
  meta: SlideMeta
}

export function parseElement(node: OoxmlNode, ctx: any): SlideElement | undefined {
  switch (node.name) {
    case 'p:sp':
      return parseShape(node, ctx)
    case 'p:pic':
      return parsePicture(node, ctx)
    case 'p:cxnSp':
      return parseConnectionShape(node, ctx)
    // case 'dsp:sp':
    //   return parseDsp(node, ctx)
    case 'p:graphicFrame':
      return parseGraphicFrame(node, ctx)
    case 'p:grpSp':
      return parseGroupShape(node, ctx, parseElement)
  }
  return undefined
}

export function parseSlide(slide: OoxmlNode, path: string, ctx: any): Slide {
  return {
    id: idGenerator(),
    ...parseTiming(slide.find('p:timing')),
    ...parseTransition(slide.find('mc:AlternateContent')),
    style: {
      width: ctx.presentation.slideWidth,
      height: ctx.presentation.slideHeight,
    },
    background: parseBackground(slide.find('p:cSld/p:bg'), ctx),
    children: slide
      .get('p:cSld/p:spTree/*')
      .map(node => parseElement(node, ctx))
      .filter(Boolean) as SlideElement[],
    meta: {
      inCanvasIs: 'Element2D',
      inPptIs: 'Slide',
      pptPath: path,
      pptLayoutPath: ctx.layout.meta.pptPath,
      pptMasterPath: ctx.master.meta.pptPath,
      pptThemePath: ctx.theme.meta.pptPath,
    },
  }
}

function stringifyElement(node: SlideElement): string | undefined {
  switch (node.meta.inPptIs) {
    case 'Shape':
      return stringifyShape(node as Shape)
    case 'Picture':
      return stringifyPicture(node as Picture)
    case 'GroupShape':
      return stringifyGroupShape(node as GroupShape, stringifyElement)
    case 'ConnectionShape':
    case 'GraphicFrame':
      break
  }
  return undefined
}

export function stringifySlide(slide: Slide): string {
  return `<p:sld
  xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
  xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
>
  <p:cSld>
    ${withIndents(stringifyBackground(slide.background), 2)}
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="0" cy="0"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="0" cy="0"/>
        </a:xfrm>
      </p:grpSpPr>
      ${withIndents(slide.children?.map(stringifyElement).filter(Boolean) as string[], 3)}
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr>
    <a:masterClrMapping/>
  </p:clrMapOvr>
  ${stringifyTransition(slide.transition)}
  ${stringifyTiming(slide)}
</p:sld>`
}
