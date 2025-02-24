import type { IDOCElementDeclaration } from 'modern-idoc'
import type { OOXMLNode } from '../core'
import type { ColorMap } from './color-map'
import type { SlideElement } from './slide'
import { parseBackground } from './background'
import { parseColorMap } from './color-map'
import { parseElement } from './slide'
import { parseTiming } from './timing'

export interface SlideLayout extends IDOCElementDeclaration {
  children: SlideElement[]
  meta: {
    id: string
    masterId: string
    colorMap?: ColorMap
  }
}

export function parseSlideLayout(slide: OOXMLNode, id: string, ctx: any): SlideLayout {
  return {
    fill: parseBackground(slide.find('p:cSld/p:bg'), ctx),
    children: slide
      .get('p:cSld/p:spTree/*')
      .map(item => parseElement(item, ctx))
      .filter(Boolean) as SlideElement[],
    meta: {
      id,
      masterId: ctx.master.id,
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
