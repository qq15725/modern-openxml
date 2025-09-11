import type { NormalizedElement } from 'modern-idoc'
import type { OoxmlNode } from '../core'
import type { ColorMap } from './colorMap'
import type { SlideElement } from './slide'
import { idGenerator } from 'modern-idoc'
import { parseBackground } from './background'
import { parseColorMap } from './colorMap'
import { parseElement } from './slide'
import { parseTiming } from './timing'

export interface SlideLayout extends NormalizedElement {
  children: SlideElement[]
  meta: {
    inPptIs: 'SlideLayout'
    pptPath: string
    pptMasterPath: string
    pptThemePath: string
    colorMap?: ColorMap
  }
}

export function parseSlideLayout(slide: OoxmlNode, path: string, ctx: any): SlideLayout {
  return {
    id: idGenerator(),
    style: {
      width: ctx.presentation.slideWidth,
      height: ctx.presentation.slideHeight,
    },
    background: parseBackground(slide.find('p:cSld/p:bg'), ctx),
    children: slide
      .get('p:cSld/p:spTree/*')
      .map(item => parseElement(item, ctx))
      .filter(Boolean) as SlideElement[],
    meta: {
      inPptIs: 'SlideLayout',
      pptPath: path,
      pptMasterPath: ctx.master.meta.pptPath,
      pptThemePath: ctx.theme.meta.pptPath,
      colorMap: parseColorMap(slide.find('p:clrMap')),
      ...parseTiming(slide.find('p:timing')),
    },
  }
}

export function stringifySlideLayout(): string {
  return `<p:sldLayout
  xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"
>
  <p:cSld>
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
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr>
    <a:masterClrMapping/>
  </p:clrMapOvr>
</p:sldLayout>`
}
