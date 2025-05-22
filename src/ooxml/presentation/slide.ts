import type { NormalizedElement } from 'modern-idoc'
import type { OOXMLNode } from '../core'
import type { ConnectionShape } from './connection-shape'
import type { GraphicFrame } from './graphic-frame'
import type { GroupShape } from './group-shape'
import type { Picture } from './picture'
import type { Shape } from './shape'
import type { Timing } from './timing'
import type { Transition } from './transition'
import { withIndents } from '../utils'
import { parseBackground, stringifyBackground } from './background'
import { parseConnectionShape } from './connection-shape'
import { parseGraphicFrame } from './graphic-frame'
import { parseGroupShape, stringifyGroupShape } from './group-shape'
import { parsePicture, stringifyPicture } from './picture'
import { parseShape, stringifyShape } from './shape'
import { parseTiming, stringifyTiming } from './timing'
import { parseTransition, stringifyTransition } from './transition'

export type SlideElement =
  | Picture
  | Shape
  | ConnectionShape
  | GroupShape
  | GraphicFrame

export interface SlideMeta {
  id: string
  layoutId: string
  masterId: string
  themeId: string
}

export interface Slide extends Transition, Timing, NormalizedElement {
  children: SlideElement[]
  meta: SlideMeta
}

export function parseElement(node: OOXMLNode, ctx: any): SlideElement | undefined {
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

export function parseSlide(slide: OOXMLNode, id: string, ctx: any): Slide {
  return {
    ...parseTiming(slide.find('p:timing')),
    ...parseTransition(slide.find('mc:AlternateContent')),
    style: {
      width: ctx.presentation.width,
      height: ctx.presentation.height,
    },
    background: parseBackground(slide.find('p:cSld/p:bg'), ctx),
    children: slide
      .get('p:cSld/p:spTree/*')
      .map(node => parseElement(node, ctx))
      .filter(Boolean) as SlideElement[],
    meta: {
      id,
      layoutId: ctx.layout.meta.id,
      masterId: ctx.master.meta.id,
      themeId: ctx.theme.meta.id,
    },
  }
}

function stringifyElement(node: SlideElement): string | undefined {
  switch (node.meta.type) {
    case 'shape':
      return stringifyShape(node as Shape)
    case 'picture':
      return stringifyPicture(node as Picture)
    case 'group-shape':
      return stringifyGroupShape(node as GroupShape, stringifyElement)
    case 'connection-shape':
    case 'graphic-frame':
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
